{
  rustPlatform,
  pkgs,
  ...
}:
rustPlatform.buildRustPackage {
  name = "blog-comments";
  src = ../../backend/comments;

  WASM_PACK_CACHE = "/tmp/wasm-pack-cache";
  CARGO_HOME = "/tmp/cargo-home";

  cargoLock = {
    lockFile = ../../backend/comments/Cargo.lock;
  };

  nativeBuildInputs = with pkgs; [
  ];

}
