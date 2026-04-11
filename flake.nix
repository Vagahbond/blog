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
        frontend = pkgs.callPackage ./nix/packages/front.nix { };
        grass = pkgs.callPackage ./nix/packages/grass.nix { };
      });

      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            cargo
            rustc
            rustfmt
          ];

          shellHook = ''
            echo Now developping my blog!
          '';
        };
      });
    };
}
