{
  buildNpmPackage,
}:
buildNpmPackage {
  name = "blog";
  src = ../.;

  buildPhase = ''
    npm run build

    mkdir -p $out
    cp -r ./build/* $out
  '';

  packageJSON = ../package.json;
  packageLock = ../package-lock.json;
  npmDepsHash = "sha256-Rh9M5HCINg2qfsU0lXfn+4HelrQNx/NKozcoeujXIm0=";
}
