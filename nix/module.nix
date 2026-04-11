{ self }:
{
  lib,
  pkgs,
  config,
  ...
}:
{
  options.services.touches-grasses = {
    enable = lib.mkEnableOption "touches-grasses";

    address = lib.mkOption {
      type = lib.types.str;
      default = "127.0.0.1";
      description = "Address to bind the touches-grasses server to";
    };

    enableNginx = lib.mkEnableOption "nginx";

    grassServer = {
      enable = lib.mkEnableOption "grass-server";

      host = lib.mkOption {
        type = lib.types.str;
        default = "127.0.0.1";
        description = "Host to bind the grass server to";
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = 3012;
        description = "Port to bind the grass server to";
      };

      grassTickIntervalSeconds = lib.mkOption {
        type = lib.types.int;
        default = 10;
        description = "Interval in seconds to tick the grass blades";
      };

      secure = lib.mkOption {
        type = lib.types.bool;
        default = false;
        description = "Use wss:// instead of ws:// for WebSocket connections";
      };
    };
  };

  config = lib.mkIf config.services.touches-grasses.enable (
    lib.mkMerge [

      {
        users.users.touches-grasses = {
          isSystemUser = true;
          group = "touches-grasses";
        };

        users.groups.touches-grasses = { };
      }

      (lib.mkIf config.services.touches-grasses.enableNginx {
        # Assert that if ngix is enabled, the main service has an address
        assertions = [
          {
            assertion = config.services.touches-grasses.address != null;
            message = "nginx is enabled, but the main service has no address";
          }
        ];

        services.nginx.virtualHosts = {
          ${config.services.touches-grasses.address} = {
            enableACME = true;
            forceSSL = true;
            root = self.packages.${pkgs.system}.frontend.override {
              grassServerUrl = "${
                if config.services.touches-grasses.grassServer.secure then "wss" else "ws"
              }://${config.services.touches-grasses.grassServer.host}:${toString config.services.touches-grasses.grassServer.port}";
            };
          };
          ${config.services.touches-grasses.grassServer.host} =
            lib.mkIf config.services.touches-grasses.grassServer.enable
              {
                enableACME = true;
                forceSSL = true;
                locations."/" = {
                  proxyWebsockets = true; # needed if you need to use WebSocket
                  proxyPass = "http://127.0.0.1:${toString config.services.touches-grasses.grassServer.port}";
                  # proxyHttpVersion = "1.1"; # Required for WebSockets
                  # proxySetHeader = [
                  #   "Upgrade $http_upgrade" # Required for WebSocket upgrade
                  #   "Connection \"upgrade\"" # Required for WebSocket upgrade
                  # ];
                };

                extraConfig = ''
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "upgrade";
                '';
              };
        };
      })

      (lib.mkIf config.services.touches-grasses.grassServer.enable {

        systemd.services.touches-grasses-grass = {
          wantedBy = [ "multi-user.target" ];
          serviceConfig = {
            User = "touches-grasses";
            Type = "simple";
            ExecStart = lib.escapeShellArgs [
              "${self.packages.${pkgs.system}.grass}/bin/backend"
              "-p"
              (toString config.services.touches-grasses.grassServer.port)
              "-g"
              (toString config.services.touches-grasses.grassServer.grassTickIntervalSeconds)
            ];
          };
        };
      })

    ]
  );
}
