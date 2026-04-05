---
title: "L'emballage de tes gros paquets"
date: 2026-02-19T00:00:00+05:30
draft: false
tldr: "Le gestionnaire de paquets de l'écosystème Nix"
series: "Nixer ou l'art de la reproduction"
index: 2
---

Pour les débutants, un gestionnaire de paquets, ça te permet d'installer des logiciels sur ton ordi, sans aller sur Softonic pour télécharger "installer.exe" et cliquer 50 fois sur "ne pas installer cette merde inutile qu'on essaye d'enfourner de force sur mon système".

Ça propose aussi un certain niveau de garantie sur *qui* a publié le package que tu installes. Pour ceux qui n'utilisent pas Arch Linux, c'est un peu comme demander des rapports de dépistage à tes partenaires avant qu'il ne se passe quoi que ce soit. Ça évite d'attraper des trucs que t'avais pas spécialement demandés. 



![](/assets/9nFzsfnoj4aDUEy4Qims8JA81KqoZD_4PxqD7kYIIhc=.png)

Toutes les distributions Linux ont un gestionnaire de paquets associé, le plus connu étant celui de Debian/Ubuntu :

`sudo apt install microsoft-edge`



Je serais surpris que tu n'aies jamais vu cette formule trainer quelque part.



Il y a deux façons dont un gestionnaire de paquets peut te livrer les logiciels. 

L'option préférable est de donner un environnement et le code source, et de compiler le programme sur ta machine. Cependant, à moins d'être un Gentoo bro, t'as pas que ça à foutre de compiler Firefox pendant 3 heures entières sur ton serveur dédié. 

![](/assets/i0XNj_OC-3j-paFc5CBXGC4xJlSqIpYFw8jboX66L18=.png)

Dans ce cas, tu préfères télécharger directement le binaire de l'app depuis un cache binaire, ou depuis le dépot de paquets lui-même.

Pourquoi la première option est-elle préférable ? Parce que compiler sur ton propre matériel, c'est t'assurer au moins un peu que le binaire que tu vas exécuter n'est pas compromis à l'insu de ton plein gré.



Ces gestionnaires de paquets sont parmi le top des raisons de la suprématie de Linux d'après moi. Évidemment, il en existe aussi sur Windows, mais ça n'est absolument pas natif. Les fanboys me parleront de [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) mais franchement les gars, vous avez raté le coche. Je ne connais personne qui utilise votre merde, et ce ne sera pas mon cas non plus.

Oh, j'avoue prendre un certain plaisir à cracher sur Microsoft. Si ce n'est pas encore ton cas, c'est qu'une question de temps, ne t'en fais pas. 

Revenons à Nix.

Dans l'éco-système Nix, il y a un gestionnaire de paquets, du nom absolument imprévisible de Nix, qui contient plus de 120 000 paquets. 

En fait, il s'agit du gestionnaire de paquets avec le plus de paquets, dépassant maintenant l'AUR et ses 98 765 paquets, à l'heure à laquelle j'écris cet article. Si tout va bien, t'as compris soit cette phrase, soit celle sur les rapports de dépistage.

On peut y rechercher des paquets de façon extrêmement pratique avec [ce site](https://search.nixos.org/packages?channel=unstable\&query=internet-explorer). Il y a aussi des [CLI](https://github.com/nix-community/nh) qui permettent de faire ça.

Nix propose plusieurs façons d'installer, voire d'utiliser des paquets, pour différentes situations. 



**La méthode impérative**

Avec les `nix-profiles`, on peut installer des paquets impérativement comme avec n'importe quel autre gestionnaire de paquets. Tape la commande suivante : 

`nix-env -iA internet-explorer`

et hop, tu peux commencer à surfer le web avec le meilleur navigateur de tous les temps.

Si tu n'as besoin de paquets que pour un petit instant, histoire de tester un truc, mais que tu n'as pas envie de l'installer, tu peux faire un shell éphémère: 

`nix-shell -p nodejs`

Cette commande te permet d'ouvrir un shell temporaire avec NodeJS dedans. 



Par la suite, tout ce qui a été installé spécialement pour ce shell dans ton nix-store sera ramassé par le `garbage collector` de nix dès que ce dernier sera appelé, au lieu de prendre toute la place inutilement sur ton ordi pendant 10 ans.

Tu veux juste run cmatrix pour impressionner tout le monde, et tu n'as pas besoin de shell ? Ton pote te casse les couilles depuis 5 semaines pour que tu essayes ce nouveau langage dont t'as rien à branler ? Nix a aussi une solution pour toi : 

`nix run nixpkgs#cmatrix -- --mon-arg1`

Même pas de shell éphémère, la commande est lancée et c'est tout.

Merveilleux, n'est-ce pas ? Ton ordi sera déjà bien moins rempli d'innombrables conneries que tu n'utiliseras pas de ton vivant.

![](/assets/IuOadfNRr2yWOZcK8k9NBjpe44ozjrYmplA34FXbNTY=.png)

Et cette fonctionnalité s'étend bien au-delà de ces exemples avec les `flake`, dont on parlera plus tard.

Sauf que souviens-toi : nix, c'est déclaratif, et reproductible. Si `nix run` et `nix-shell` ont indéniablement une place dans ton workflow, utiliser nix-env n'a pas vraiment de sens. 

C'est littéralement nixer sans reproduction.

Alors, comment es-tu censé nixer ?

**La manière déclarative**

Là, on commence à parler. 

Avec Nix, il y a plusieurs moyens d'installer des paquets de façon déclarative. 



La fonctionnalité de shell éphémère avec `nix-shell -p` est formidable, mais ne répond pas à tout.

Peut-être as-tu besoin d'un ensemble de paquets/dépendances bien particulier pour compiler ton projet ?

Peut-être as-tu besoin de variables d'environnement ? 

Peut-être as-tu besoin d'une base de donnée qui tourne en local pour développer ton projet ?

Si c'est le cas, il y a de grandes chances que tu aies installé `docker` et que tu fasses du développement dans des conteneurs avec des volumes partagés. 

Et si c'est le cas, ton disque dur est certainement saturé de volumes à la con, d'images Docker périmées, et j'en passe. 

Ta RAM se remplit certainement quasi-instantanément dès que tu as un projet à ouvrir avec BDD+Back-end+Front-end.

Le coût supplémentaire qu'une stack de développement `docker` apporte n'est pas seulement gargantuesque : il est aussi parfaitement inutile.  

![](/assets/JPvE7LcfTaZXoQRT4BzSy6hVtmUssov4I44hnSRcKV0=.png)

Face à ce problème d'environnements de développement complexes, il y a aussi des outils comme [devenv](https://learn.microsoft.com/en-us/visualstudio/ide/reference/devenv-command-line-switches?view=visualstudio) chez Micromerde ou [venv](https://docs.python.org/3/library/venv.html) chez Python qui permettent de définir un shell dans un fichier déclaratif. 

On se rapproche de notre but, mais ces solutions ne sont pas techno-agnostiques. Imagine apprendre un nouvel outil, pour faire la même chose avec chaque techno que tu utilises. 

L'horreur.

Alors prépare-toi : 

Avec Nix, on peut décrire un devshell dans un fichier `shell.nix` ou dans un `flake.nix`, d'une façon qui marchera dans 99 % des cas sur toute autre machine avec `nix` installé, et pour n'importe quelle techno.

Voici à quoi ça ressemble : 

```nix
# shell.nix
{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [ ruby_3_2 ];
    MY_ENV_VAR = "some_secret";
}
```

Beaucoup d'autres aspects sont réglables via ce système, qui sert en quelque sorte de recette pour créer des shells via `nix-shell`.

Avec cette beauté dans mon repo, je tape `nix-shell` et j'attends 1 seconde, et tout est là. Plus qu'à développer. Au lieu de te battre avec ton environnement de développement, tu tapes une foutue commande et tu peux passer au code.

Je compte aborder ces shells plus en détail avec un article plus orienté pratique et en incluant les flake, plus tard. 



Fini de péter des câbles sur ton clavier et d'avoir mal aux yeux alors que t'as pas encore écrit une seule ligne, espèce d'escroc.



"Mais si je veux installer un paquet et qu'il reste installé ?"

On y vient, mon margoulin, on y vient.

Je t'expliquerai plus en détail ce que c'est que `NixOS` plus tard, pour le moment, tu dois comprendre qu'il y a des modules dans celui-ci qui te permettent de définir les propriétés de ton système d'exploitation sous forme de code Nix. 

T'es sur \<Insérer une distro linux ici> et tu veux pas changer ? Il y a `home-manager`.

T'es sur Mac et tu veux pas changer ? il y a `nix-darwin`.

Ces deux-là vont moins loin dans ce que tu peux rendre reproductible sur ton système, mais te dispensent de toute excuse valable pour ne pas switcher à `nix`.



Tous ces systèmes ont pour point commun qu'ils te permettent une gestion aux petits oignons de ton poste, dont les paquets installés et disponibles dans ton `PATH`.

En général, c'est comme ça qu'on installe un paquet : 

```nix
environment.systemPackages = with pkgs; [ package1 package2 ];
```

Puis on lance une commande, du genre `nixos-rebuild switch`, pour activer les changements.

Maintenant tu peux mettre cette configuration Nix quelque part sur un gestionnaire de dépôts de code, et l'appliquer à chacune de tes machines pour avoir ton set de paquets préférés disponibles. 

Mais ce n'est pas tout. 

Toi aussi tu veux utiliser Vesktop, mais tu peux pas blairer ce foutu drapeau qui ne correspond à aucun pays et qui est brandi par des malades mentaux partout où tu vas ?

Avec Nix, tu peux utiliser des `overlays` et modifier les packages de manière unique pour ton système, et à chaque mise à jour et pour chacune de tes machines, ce sera appliqué. 

Tu peux changer l'icône d'une app à son installation, tu peux appliquer un patch au code, tu peux faire **ce que tu veux.&#x20;**

Les seules limites sont ton imagination et tes compétences en nixage. On parlera des `overlays` plus en détail dans un autre article, sinon on y est encore demain.



Plus haut, je t'explique que les package managers ont deux moyens de livrer les packages: 

Soit ce sont des sources que tu compiles toi-même, soit ce sont des binaires que tu télécharges tout faits.

Nix te permet d'ajouter, ou pas, des `substituer`, qui sont des serveurs qui compilent les paquets avant toi et te les envoient tout compilés. 

Tu choisis en quels serveurs tu as confiance et tu choisis ce que tu veux build en local ou télécharger en binaire. Cet aspect se règle dans la configuration Nix définie plus haut.

Dans le cas des programmes donc les sources ne sont pas disponibles, les **horribles&#x20;**&#x70;rogrammes en sources fermées (exemple: Android Studio AKA le fossoyeur de ta RAM), nix refuse initialement de les installer. 

Cependant,&#x20;**&#x20;**&#x61;vec une petite variable d'environnement, et un argument `--impure` à l'appel de la commande `nix`, on peut contrecarrer cette barrière. 

On ne va pas se mentir, parfois, c'est à la limite de l'insupportable. Mais c'est aussi un petit rappel pour te faire utiliser plus de programmes au code source ouvert. 

Pour un futur plus libre en ligne, le changement vient autant de toi que de moi et de tous les utilisateurs. 

![](/assets/Slg3thzmWB27xUK0pq5nKkpQICBo0Xe3WFDxi1Hfc20=.png)

T'es en train de lire `touches-grasses.fr`, pas `clef-en-main-pour-fatass.fr`, tu croyais qu'il suffisait de chialer sur Twitter pour avoir un meilleur internet ? 

Et puisqu'on parle de ça, c'est l'heure du sermon. Si tu peux faire tout ce qui est décrit plus haut en mode hackerman, ça ne tombe pas du ciel.

Quelqu'un a pris le temps de créer une déclaration en `nix` pour compiler chacun des paquets disponibles dans leur environnement encapsulé Nix. On peut retrouver toutes ces déclarations sur [GitHub](https://github.com/NixOS/nixpkgs). Elles sont faites par des enthousiastes, des badauds comme toi et moi, sauf qu'eux ils sont pas gros.

Ils ne sont pas tous des M. Robot à 150 de QI, et parfois ce qu'ils ont fait est imparfait et dégueulasse. Sauf que eux, contrairement à toi, ils ont construit des trucs qui marchent et que les gens utilisent.

Si les badelards l'ont fait, pourquoi est-ce que toi tu ne pourrais pas ? Si un paquet que tu veux utiliser est cassé ou inexistant, tu n'es sûrement pas le seul à vouloir l'utiliser.

Tu peux créer des déclarations de paquets en Nix pour des logiciels que tu aimes utiliser, et proposer assez facilement une PR à Nixpkgs. 

S'ils acceptent, à toi la gloire, la coke et les putes. 

S'ils demandent des amendements à la PR, c'est pas la honte, c'est même quasi inévitable à vrai dire. Et puis comme je le disais, crois-moi certains bouts de code sur nixpkgs sont DÉGUEULASSES. 

T'en apprends plus en te faisant réfuter tes propositions qu'en regardant des vidéos Youtube du fond de ton fauteuil comme l'immense patapouf que tu es.

S'ils refusent, ça n'est pas du temps perdu. T'as gagné en compétences, tu peux utiliser ton logiciel avec Nix et si quelqu'un a besoin du même, il pourra éventuellement trouver ton travail et attirer l'attention dessus. 



Dans le sens inverse, il est possible que le paquet que tu recherches ne soit pas dans nixpkgs mais que quelqu'un d'autre l'ait packagé de son côté dans un `flake`. Dans ce cas, il est possible pour toi d'importer ce flake dans ta configuration, et même de l'inclure dans un shell que tu crées à la volée comme montré plus haut.

Exemple : 

`nix run github:notashelf/nvf`

nvf est une distribution de NeoVim configurable via Nix. Tu peux l'utiliser avec `nix-run` ou l'ajouter à ta configuration.



Mais alors, ces déclarations de paquets, ces configurations de systèmes, comment ça marche ? 

Quelle est la complexité ajoutée qui vient avec toute cette reproduction ? 

Il va falloir qu'on parle du langage Nix...

![](/assets/6uY2Nfy0egIP1Ampy43w1YnwCCis0Imf0KIMnvM6n6c=.png)



Avec une présentation sommaire du langage Nix, on va continuer de solliciter ce vase d'eau tiède qui te sert de cafetière. 



En attendant le prochain épisode de cette série sur l'art de la reproduction, prends soin de toi, fais du sport, et n’oublie pas de toucher de l’herbe cette semaine.
