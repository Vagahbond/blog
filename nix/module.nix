{ self }:
{
  lib,
  pkgs,
  config,
  ...
}:
{
  options.services.touchesGrasses = {
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
    commentsServer = {
      enable = lib.mkEnableOption "comments-server";

      host = lib.mkOption {
        type = lib.types.str;
        default = "127.0.0.1";
        description = "Host to bind the comments server to";
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = 3013;
        description = "Port to bind the comments server to";
      };

      secure = lib.mkOption {
        type = lib.types.bool;
        default = false;
        description = "Use wss:// instead of ws:// for WebSocket connections";
      };
    };
  };

  config = lib.mkIf config.services.touchesGrasses.enable (
    lib.mkMerge [

      {
        users.users.touches-grasses = {
          isSystemUser = true;
          group = "touches-grasses";
        };

        users.groups.touches-grasses = { };
      }

      (lib.mkIf config.services.touchesGrasses.enableNginx {
        # Assert that if ngix is enabled, the main service has an address
        assertions = [
          {
            assertion = config.services.touchesGrasses.address != null;
            message = "nginx is enabled, but the main service has no address";
          }
        ];

        services.nginx.virtualHosts = {
          ${config.services.touchesGrasses.address} = {
            enableACME = true;
            forceSSL = true;
            root = self.packages.${pkgs.system}.frontend.override {
              grassServerUrl = "${
                if config.services.touchesGrasses.grassServer.secure then "wss" else "ws"
              }://${config.services.touchesGrasses.grassServer.host}";
            };
          };
          ${config.services.touchesGrasses.grassServer.host} =
            lib.mkIf config.services.touchesGrasses.grassServer.enable
              {
                enableACME = true;
                forceSSL = true;
                locations."/" = {
                  proxyWebsockets = true; # needed if you need to use WebSocket
                  proxyPass = "http://127.0.0.1:${toString config.services.touchesGrasses.grassServer.port}";
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

          ${config.services.touchesGrasses.commentsServer.host} =
            lib.mkIf config.services.touchesGrasses.commentsServer.enable
              {
                enableACME = true;
                forceSSL = true;
                locations."/" = {
                  proxyWebsockets = true; # needed if you need to use WebSocket
                  proxyPass = "http://127.0.0.1:${toString config.services.touchesGrasses.commentsServer.port}";
                };

                extraConfig = ''
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "upgrade";
                '';
              };
        };
      })

      (lib.mkIf config.services.touchesGrasses.grassServer.enable {

        systemd.services.touchesGrasses-grass = {
          wantedBy = [ "multi-user.target" ];
          serviceConfig = {
            User = "touches-grasses";
            Type = "simple";
            ExecStart = lib.escapeShellArgs [
              "${self.packages.${pkgs.system}.grass}/bin/grass"
              "-p"
              (toString config.services.touchesGrasses.grassServer.port)
              "-g"
              (toString config.services.touchesGrasses.grassServer.grassTickIntervalSeconds)
            ];
          };
        };
      })

      (lib.mkIf config.services.touchesGrasses.commentsServer.enable {

        system.services.postgres = {
          ensureDatabases = [ "touches-grasses" ];
          ensureUsers = [
            {
              name = "touches-grasses";
              ensurePermissions = {
                "DATABASE touches-grasses" = "ALL PRIVILEGES";
              };
            }
          ];
        };

        systemd.services.touchesGrasses-comments = {
          wantedBy = [ "multi-user.target" ];
          serviceConfig = {
            User = "touches-grasses";
            Type = "simple";
            ExecStart = lib.escapeShellArgs [
              "${self.packages.${pkgs.system}.comments}/bin/comments"
              "-p"
              (toString config.services.touchesGrasses.grassServer.port)
              "-g"
              (toString config.services.touchesGrasses.grassServer.grassTickIntervalSeconds)
            ];
          };
        };
      })
    ]
  );
}
