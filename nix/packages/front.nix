{
  buildNpmPackage,
  grassServerUrl ? "ws://localhost:3012",
}:
buildNpmPackage {
  name = "blog";
  src = ../../.;

  GRASS_SERVER_URL = grassServerUrl;

  buildPhase = ''
    echo 'PUBLIC_GRASS_SERVER_URL=${grassServerUrl}' > ./.env

    npm run build
    mkdir -p $out
    cp -r ./build/* $out
  '';

  packageJSON = ../../package.json;
  packageLock = ../../package-lock.json;
  npmDepsHash = "sha256-aTir5gDjCMF9osOCC1NORgVw4pJVOhgn25/EyYPu2cY=";
}
