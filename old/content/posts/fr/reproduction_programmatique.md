---
title: "Reproduction programmatique"
date: 2026-02-27T00:00:00+05:30
draft: false
tldr: "Présentation du langage nix"
series: "Nixer ou l'art de la reproduction"
index: 3
---


La semaine dernière, on a parlé de comment on peut installer des paquets de façon déclarative. 

La semaine prochaine, on parlera du système de modules déclaratif dans l'écosystème Nix.

Tu l'auras compris donc, aujourd'hui on va parler du paradigme déclaratif. 

Alors attention, on ne va pas apprendre à déclarer ses revenus à la direction générale du raquettage public. Pour ça tu te démerdes, chacun sa spécialité. 

![](/assets/J4-uQTu3P0FcYoHTd7iaNmwHJztTiWLUSWtIwHBKfYU=.png)



En fait, si tu codes, il y a de grandes chances que tu fasses déjà de l'impératif :

Les langages qui permettent de définir des séries d'instructions à exécuter par la machine. 

Tu peux faire ça avec du C, avec du TS, avec du Java, et j'en passe. 



En opposition à ça, il y a le paradigme de programmation appelé "déclaratif" :

En programmation déclarative, il n'y a pas d'état général. Au lieu de donner lieu au résultat final par une série d'ordres, on décrit le résultat final, et l'interpréteur y donne vie.

![](/assets/BCBU9uwFbPm0skDFPMZBfOaNXvo4X5Vic3uGQprHGcU=.png)

## Des bases

Nix est un langage :

* Déclaratif
* Fonctionnel : permet la composition de fonctions pour décrire une valeur
* Typé dynamiquement : une variable/un attribut peut changer de valeur en cours de route
* En évaluation différée : on n'évalue que les attributs dont on a besoin, quand on en a besoin
* Qui ressemble au Lisp, de loin et en plissant les yeux
* Qui ressemble à JSON, autant qu'une caisse à savon ressemble à une voiture



Nix est basé sur les `attrsets`, des objets ressemblant à ceux de JS. 

Voici un exemple d'`attrset` : 

```nix
{
  clef = "valeur";
}
```

Dans cet exemple, on peut facilement remplacer `"valeur"` par une expression, ici on fait appel à une fonction.

```nix
{
  clef = add 1 2;
}
```

L'évaluation d'un code écrit en `nix` se termine avec un grand `attrset`, composé de tous ceux que tu déclareras çà et là. 

Dans le cas ci-dessus, on renseigne la valeur pour la clef `clef`. 



Parfois, on veut créer des valeurs intermédiaires pour structurer notre code, mais on ne veut pas que celles-ci finissent dans le grand hash final. Il y a une solution pour ça.   

On peut déclarer des variables pour un `attrset` avant de le commencer: 

```nix
let 
  truc = 1+2;
in
{
  machin = truc;
}
```

Evidemment, `nix` permet de créer des fonctions, et celles-ci ont une drôle de ganache: 

Fonction simplifiée :

```nix
let
  # Déclarer
  maFonction = arg: 1 + arg;
in
{
  # Appeler
  machin = maFonction 2; # 3
}
```

Fonction à paramètres nommés : 

```nix
let 
  maFonction = { tonPere, taMere, taSoeur } : pkgs.lib.join ", " [ tonPere taMere taSoeur ];
in 
maFonction { tonPere = "JMLP"; taMere="Sardine Ruisseau"; taSoeur="Marlene Shiappa"; }

# Résultat: "JMLP, Sardine Ruisseau, Marlene Shiappa"
```

Cette syntaxe capilotractée peut te faire beaucoup de nœuds au cerveau si, comme moi, tu es habitué aux paradigmes de programmation plus standards.

Tu l'auras peut-être déjà remarqué, mais ici, on finit toutes nos lignes par des `;`, comme dans tous les **vrais&#x20;**&#x6C;angages. Déso, pas déso si tu fais du python.

Tu l'auras aussi remarqué, mais ici pas de classes, et ça, ça fait du bien.

![](/assets/hqMMGLG3A8c0MlZrx4S7SjvaBDh8XRDfisMEY3wO0b8=.png)



Dans ce langage, on a accès à la librairie standard au travers de l'attribut `pkgs.lib` , qui contient toute une ribambelle de fonctions pour les opérations de base, mais aussi celles bien spécifiques à `nix` (par exemple, des fonctions qui servent à créer des dérivations pour packager un programme).

Il est difficile de trouver des ressources exhaustives sur cette lib. Le plus souvent, j'utilise [ce site notamment pour les helpers qui servent à paqueter des applications.](https://nixos.org/manual/nixpkgs/stable/#part-builders)



Avant de passer à la suite, je pense que ça t'aidera de voir quelques exemples.

## Exemples simples de nix

**package**

Voici un exemple de package d'application Rust, avec le helper `buildRustPackage`: 

```nix
pkgs.rustPlatform.buildRustPackage {
  name = "monApp";
  src = ./.;
  cargoLock = {
    lockFile = ./Cargo.lock;
  };
  buildInputs = with pkgs; [
    cargo
    rustc
    rustfmt
  ];
}
```

On donne le lockfile à `buildRustPackage` pour qu'il puisse pré-télécharger toutes les dépendances avant la compilation. C'est nécessaire car ces dépendances auront un hash assigné comme toute autre dérivation Nix, et car au moment du build, il n'y a pas accès à internet pour des raisons de pureté.

`buildInputs` permet de designer des packages requis au moment du build. On a intérêt à ce que Cargo soit installé quand on va run `cargo build`.

`src` prend un chemin relatif comme valeur et il chargera dans ce chemin tous les fichiers qui ont été `staged` par `git`. Si tu viens d'ajouter un fichier à ton projet, ton build va rater jusqu'à ce que tu le `stage`. Pas besoin de commit, on n'est pas des bêtes.

Avec la dérivation ci-dessus dans ton Flake tu peux `nix build .` et dans un dossier nommé `result`, tu trouveras l'exécutable de ton programme. Il sera aussi possible de l'ajouter à NixPKGs.

**shell**

```nix
pkgs.mkShell {
  buildInputs = with pkgs; [
    cargo
    rustc
    rustfmt
  ];
}
```

Pour développer sur le paquet déclaré ci-dessus, tu as besoin de cargo, rustc et rustfmt. 

Mais les installer sur ta machine, c'est la giga-loose. Faut dire que t'es en train d'apprendre Rust, et t'es même pas sûr de continuer. Dans le même projet, tu peux créer un shell nix que tu lanceras avec `nix-develop`.

Ici on utilise le helper `mkShell` de la librairie standard. On déclare dans ce shell des `buildInputs` comme au-dessus. 

Il s'agit d'une liste de packages. Les packages sont accessibles via `pkgs`, tout comme beaucoup de fonctions de la "lib standard". 

Une liste se déclare de la façon suivante : `[ truc autreTruc encoreUnAutre ]` avec des espaces entre les éléments et pas des virgules.



## Nix c'est pas parfait

Entre la syntaxe cheloue et la pureté attendue dans le paradigme de la programmation fonctionnelle (pas de `console.log` ici !), nix peut être une horreur à débugger. Sans parler des erreurs pas toujours claires dans la stacktrace, je pense particulièrement aux problèmes de récursions qui vont te faire manger ton clavier. 

Il sera quand même juste de préciser que, ces dernières années, Nix semble s'être rendu beaucoup plus accessible avec des erreurs plus claires qu'avant. 

Il y a aussi moyen de débugger ses dérivations à l'aide de deux outils particulièrement utiles : 

* [builtins.trace](https://noogle.dev/f/builtins/trace)
* [nix-repl avec l'option -f](https://nix.dev/manual/nix/2.33/command-ref/new-cli/nix3-repl.html)

Malgré ces améliorations, le langage `nix` reste assez cryptique, et demande du temps et de l'investissement. 

La documentation n'aide pas : elle est étalée entre plein de sites indépendants les uns des autres, et rarement à jour. 

Des choses simples comme packager une app NodeJS peuvent être des challenges prodigieux si tu as la malchance de ne pas tomber tout de suite sur le bon blogpost, voire si aucune ressource n'existe vraiment. 
Il m'est arrivé de parvenir à mes fins après 4 heures de recherche, en tombant sur l'issue Nº 1997539 qui parle de la feature que je veux utiliser et donne un exemple qui me permet de comprendre ce que je fais et comment le faire.  

En fait, parfois, tu gagnes du temps en allant directement lire le code de nix sur le [dépôt GitHub](https://github.com/NixOS/nixpkgs).

![](/assets/xG2glWGOZ1hu4D7594p7OPPA3G2TPIZZTeYTXksqc6w=.png)

Pour étoffer mon propos, certains écosystèmes comme NodeJS reposent sur des cascades INTERMINABLES de paquets interdépendants. Ils sont horribles avec Nix pour une raison somme toute prévisible. 

Pour la reproductibilité, nix construit les paquets dans un environnement séparé d'internet, il faut donc pré-packager "à la nix" chaque dépendance. C'est là qu'interviennent les `helpers` mais ceux-ci sont encore plus ou moins expérimentaux et souvent la documentation est difficile à trouver et à comprendre.



## Conclusion

Je compte bien apporter ma pierre à l'édifice et rendre `nix` accessible en continuant cette série avec des articles plus orientés pratique, portés sur des cas réels d'ingénieurs informatiques. L'idée est de rester loin des tribulations autistes du public qui surfent sur la mode Nix. Les communautés comme Unixporn m'ont énormément inspiré dans mon voyage avec Linux et, bien que leurs Discords soient rempli de gobelins qui ne touchent pas assez d'herbe, beaucoup d'entre eux sont très compétents techniquement parlant. 

Bref.

En contrepartie de cette complexité, on a là un langage qui permet, de façon centralisée et fiable, de déclarer le système de plusieurs machines dans un seul dépôt, qui sera toujours accessible et qui, dans une certaine mesure, permettra de rétablir ton environnement de travail en un clin d'œil sur n'importe quelle machine. Si ton PC se fait gnaquer par ton chien, et que t'en rachètes un, tu pourras reporter ta configuration dessus et reprendre ton travail très rapidement, sans avoir débugger ton super script de setup Arch Linux qui périme tous les deux ans. 

![](/assets/PAzmrk-3IzWNW2b6tzhajaEC5EMX_3691ocwkkJvJcQ=.png)

De la même façon, ce langage permet de déclarer l'environnement de compilation de ton programme, avec toutes les dépendances nécessaires, et de le compiler sur n'importe quel ordinateur qui a `nix` d'installé (même pas besoin de NixOS), et en étant à peu près sûr que ça va build. 

Je te laisse imaginer ce que ça donne si tu te casses souvent les dents sur de la CI parce que ton programme est complexe et a des dépendances étranges : `nix` sera ton dentiste.



Le langage `nix` permet de créer des packages, des shells temporaires, et enfin de configurer `home-manager`, `nix-darwin` et `NixOS`, et tout ça de façon déclarative.

Alors toi aussi, plutôt que de **niquer** ton poste de travail en faisant les mises à jour Grub sur ton dual boot Arch Linux, lance-toi et **nixe-**&#x6C;e !



Maintenant tu sais ce qu'est `nix` *le package manager*, et tu sais ce qu'est `nix` *le langage*. 

La semaine prochaine, on apprendra ce qu'est un module et comment le langage nix peut définir autre chose que des paquets, avec entre autre nix *l'OS*. 

> "Meuh j'comprends pô, moi jui venu pour les blagues et y'a pô d'blagues" 

Les blagues reviendront à la charge très vite. C'est difficile de faire des blagues quand on entre dans des details techniques !



En attendant l'arrivée des modules `nix` ou le retour des blagues, 

Fais du sport, prends soin de toi, et n'oublie pas de toucher de l'herbe cette semaine !

