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
  npmDepsHash = "sha256-mPBvws6N8Use7etqtJ9c2eOHYWlUarCcfssZgDaM98o=";
}
