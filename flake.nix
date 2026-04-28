{
  description = "Blog";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { nixpkgs, self, ... }:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs
          [
            "x86_64-linux"
            "aarch64-darwin" # Imagine nixing a mac
          ]
          (
            system:
            function (
              import nixpkgs {
                inherit system;
                config.allowUnfree = true;
                config.android_sdk.accept_license = true;
              }
            )
          );

    in
    {

      nixosModules.default = import ./nix/module.nix { inherit self; };

      packages = forAllSystems (pkgs: {
        frontend = pkgs.callPackage ./nix/packages/front.nix { };
        grass = pkgs.callPackage ./nix/packages/grass.nix { };
        comments = pkgs.callPackage ./nix/packages/comments.nix { };
      });

      devShells = forAllSystems (
        pkgs:
        let
          db = import ./nix/database.nix {
            inherit pkgs;
            project = "blog";
          };

        in
        {
          default = pkgs.mkShell {
            buildInputs = with db; [
              pkgs.nodejs
              pkgs.postgresql
              pkgs.cargo
              pkgs.rustc
              pkgs.rustfmt

              pgconfigure
              pgstart
              pginit
              pgstop
              pgseed
              pgdump

            ];

            shellHook = ''
              echo "pginit init database"
              echo "pgstart start database"
              echo "pgconfigure create db and user"
              echo "pgdump to dump db in database.sql"

              echo Now developping my blog!
            '';
          };
        }
      );
    };
}
