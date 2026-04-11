{
  rustPlatform,
  pkgs,
  ...
}:
rustPlatform.buildRustPackage {
  name = "blog-grass";
  src = ../../wasm;

  WASM_PACK_CACHE = "/tmp/wasm-pack-cache";
  CARGO_HOME = "/tmp/cargo-home";

  cargoLock = {
    lockFile = ../../backend/Cargo.lock;
  };

  nativeBuildInputs = with pkgs; [
  ];

}
