{
  description = "Blog";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { nixpkgs, ... }:
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

      packages = forAllSystems (pkgs: {
        default = pkgs.callPackage ./nix/package.nix { };
      });

      devShells = forAllSystems (pkgs: {
        default =
          let
            db = import ./nix/database.nix { inherit pkgs; };
          in
          pkgs.mkShell {
            buildInputs = with db; [
              pkgs.nodejs
            ];

            shellHook = ''

              echo Now developping my blog!
            '';
          };
      });
    };
}
