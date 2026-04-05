---
title: "Ces outils vont nixer ton ordi"
date: 2026-03-09T00:00:00+05:30
draft: false
tldr: "Les modules Nix et ce qu'on peut faire avec."
series: "Nixer ou l'art de la reproduction"
index: 4
---

Dans les articles précédents, on a vu que `nix` était un gestionnaire de paquets, et un langage. 



Dans cet article, on va expliquer dans les grandes ligne&#x73;*&#x20;*&#x63;e qu'est un module `nix`, et ainsi compléter, je l'espère, ta compréhension de ce qu'est `nix` en tant qu'éco-système. 



Je te propose l'approche suivante : d'abord, on va définir le problème et ensuite la solution.

Exactement à l'opposé de toutes les startups qui poussent comme des champignons avec "AI" dans leur nom.



Du point de vue d'un utilisateur normal : 

Pense à la relation que tu entretiens avec la machine présentement devant toi. Tu as ton OS préféré, windaube, ubuntu, arch... en fonction de ton niveau d'autisme. 



Il y a forcément eu des moments dans ta vie où tu as :

* Jeté, vendu, ou transformé en monstre de Frankenstein le précédent avant d'en racheter un
* Réinstallé après avoir tout pété (ou que tout se soit pété tout seul si t'es chez Microsoft)
* Mis à jour grub, ton kernel ou que sais-je encore et admiré avec des yeux de merlan frit le fatidique "\_" s'afficher en haut à gauche de ton écran, comme la lune dans une nuit sans étoiles qui semble te dire que c'est l'heure de se coucher.

Dans tous ces cas, t'as sûrement passé des heures à bidouiller avant de pouvoir être productif à nouveau. 

Comment ça, ça sent le vécu?

![](/assets/CwKawWvb8GqWiLYuuXduHMwfF8EAqNB-K8SFAIgxLiQ=.jpeg "L'équipe Arch qui teste la mise à jour du bootloader.")



Face à cette tragédie, tu peux te prémunir avec 3 stratégies. 

* Acheter un Mac si t'es riche
* T'habituer à utiliser les environnements par défaut comme un gigachad, laisser de côté ton individualité comme un chinois
* &#x20;Créer un script foireux pour setup son environnement préféré sur n'importe quelle machine, et qui périmera plus vite que le lait fermier non stérilisé qui causera ta descente d'organe



Ou alors, tu peux utiliser Nix et avoir un environnement de travail fonctionnel et cohérent qui vit séparément de ta machine physique. On peut presque comparer ça au `keepinventory` dans Minecraft. 



D'un point de vue administrateur système : 

Tu possèdes un parc de serveurs avec plusieurs services installés dessus. On te demande d'installer un service qui utilise telle base de données sur telle machine. 

Heureusement, Jérôme l'ancien futur retraité qui a installé tout ça a fait une doc. En toute logique, la doc de Jérôme est exhaustive, n'est-ce pas !? Tu ne prends aucun risque à toucher aux serveurs si tu l'as lue, puisque tout est à jour, n'est-ce pas !?



Tu peux aussi avoir à gérer un parc informatique de CDI, de bibliothèque, de mairie, avec des dizaines, voire des centaines de PCs et encore plus de singes pour les saccager en les utilisant n'importe comment. Au lieu de gérer des outils différents avec chacun une configuration différente, `nix` te permet de centraliser ton arsenal anti-singe.



Les modules `nix` proposent de te simplifier la vie sous tous ces aspects. Ton code nix permet de :

* Documenter ton infra, sous forme de code qui vit en prod et donc qui sera toujours à jour (le fameux production driven testing)
* Rendre toute une partie de ton système de fichiers plus intouchable que les 3 ou 4 photos manquantes des Epstein Files
* Corriger tes problèmes d'érection
* Centraliser tous les aspects de ton système en un seul dossier
* Avoir des modèles prédéfinis pour mettre en production des services d'une façon un peu plus fiable que `npm run dev` pour ton VPS tout droit réscapé du champ de patates



Bon, mais alors comment qu'est ce que ça marche-t-il ?

![](/assets/IjbnfWHa0UGUF1_d28H72KUa7jsMCw21a98gxcwR86k=.jpeg "Toi après avoir lu cet article")

## Les modules

Un module `nix`, c'est deux choses : 

* Des options (pas comme dans la raie publique française)
* Un comportement (plus facile à prédire que celui du président de la raie publique française)


Les options te permettent de configurer la façon dont un ou plusieurs logiciels vont s'installer, et se comporter. 

Il s'agit d'options purement définies dans le langage Nix, comme si chaque module avait un formulaire et te posait une série de questions :

* Tu veux que tel service écoute tel port ? 
* Tu veux que NGINX soit configuré avec tels virtualhosts ? 
* Tu veux salade tomate oignon, chef ? 
* Tu veux que Nextcloud utilise tel dossier pour stocker ses fichiers ? Tu veux quoi dans ta configuration Hyprland ? 



Quand tu importes un module dans ta configuration - laquelle ? Eh bien, LA configuration ! - tu renseignes des valeurs pour les options en fonction de ce que tu veux, et le module va créer des fichiers, des liens symboliques, ajouter des éléments (dérivations) au nix-store, et tout orchestrer en fonction de ce que tu as mis dans les options. 

Rappelle-toi : tu déclares le résultat voulu, et nix opère sa magie pour te le donner.

![](/assets/_kf5eB6AMRL84rVsjugg0a-iGPDkY15i7MPQVi6zRIk=.gif "Nix qui évalue ta config foireuse")



Un module peut importer un autre module. Alors, quel module appelle le premier ? 



C'est là qu'on parle de configuration. Il existe 3 types de modules courants, faits pour être importés par 3 modules "pères" (il y en a d'autres, mais fais pas chier). 



**Les nixosModules :**

[Nixos](https://nixos.org) est un système d'exploitation qui est entièrement généré par un module `nix`. C'est un module géant avec PLEIN d'options, et dont l'output, le résultat, est un gigantesque nix-store, dont émerge un OS fait à base de symlinks. 

Avec ce système de configurations basé sur du code `nix`, on peut faire facilement des snapshots du système et revenir en arrière quand on fait une singerie dans la configuration profonde de l'OS.

On peut aussi, à partir d'une configuration NixOS, créer un ISO assez facilement, je te laisse imaginer le champ des possibles à partir de là.

Les options sont plus nombreuses que les miettes sur ton clavier et elles sont consultables sur [ce site.](https://search.nixos.org/options)

Certains modules extérieurs sont faits pour être importés dans une configuration NixOS et permettent de simplifier la configuration (exemple : [nix-gaming](https://github.com/fufexan/nix-gaming)) ou d'ajouter des fonctionnalités et des options, comme si ça ne suffisait pas (exempe : [nix-mineral](https://github.com/cynicsketch/nix-mineral)).



**Les modules nix-darwin :**

S'il est possible de gérer un OS entier avec `nix`, il est aussi possible d'en gérer une partie. C'est là qu'intervient [nix-darwin](https://github.com/nix-darwin/nix-darwin). Ce projet apporte la beauté de la reproductibilité aux vaches à lait mordues de la pomme croquée.

Ici, pas de `systemd`, moins d'accès sur la machine, un système d'utilisateurs un peu différent.

Nix-darwin apporte une partie de NixOS sur MacOS.

Tu peux gérer tes paramètres utilisateur, installer des paquets, et entre autres, tu peux configurer tous les aspects de ton terminal avec. 

Pour les gens allergiques à la souris comme moi, c'est une bénédiction de pouvoir configurer son terminal en réutilisant 80 % de la configuration que j'utilisais sur NixOS avant de trahir ma fratrie et de rejoindre la faction des pigeons options Starbucks-nodeJS en achetant un Macbook Air.

Comme pour NixOS, il existe des modules importables dans nix-darwin qui servent à ajouter des options et des fonctionnalités qui n'existent pas dans nix-darwin de base.



**Les modules home-manager**

[Home manager](https://nix-community.github.io/home-manager/) est le dernier gros module, et un peu le vilain petit canard. Il est sujet à discussion dans la communauté, car il ne respecte qu'en partie les conventions `nix`. 



NixOS gère la partie système de ta machine, mais tu as peut-être envie de configurer tes fichiers dans ton `home directory`. C'est pour ça qu'existe home-manager. Il permet de configurer les programmes par utilisateur et de rendre reproductible de façon plus granulaire ton environnement d'utilisateur (ex: en gérant tes ~~dotfiles~~ pointsfichiers).



Par exemple, chez les gobelins, c'est pratique courante d'avoir une configuration pour son i3 dans ses dossiers utilisateur. [Hyprland propose un module home-manager pour ça](https://wiki.hypr.land/Nix/Hyprland-on-Home-Manager/).



En règle générale, on installe soit un des trois, soit un des deux premiers, et le troisième en bonus pour gérer les profils utilisateurs. 

Ensuite, pour chaque programme que l'on veut utiliser, soit il est déjà  présent dans NixOS ou Nix-Darwin, soit il n'y est pas. Il peut alors exister en dehors, dans un `flake` qui contient son propre module. 

Il est aussi possible de créer des modules au sein de sa configuration, par exemple pour réutiliser du code entre plusieurs hôtes avec des valeurs différentes çà et là, ou encore utiliser ses propres programmes. Ou que sais-je encore, chacun est libre de sur-ingénierie selon ses goûts.

C'est quoi un `flake` ? Ce concept-là mérite un (ou 10) article à lui tout seul. Pour le moment, on essaye de comprendre c'est quoi Nix, et à quoi ça sert.



**La configuration**

Je mentionne plusieurs fois "ta configuration", comme s'il s'agissait d'un attribut privé dont on dispose tous. 

Il faut que j'explique pourquoi, avant que tu ne jettes ton ordi par la fenêtre et commences à twitter que "touches-grasses il explique vraiment mal".

Comme je le répète religieusement depuis 3 articles, `nix` permet de configurer tout un parc informatique dans un seul répo. 

En fait, dans un seul répo, on peut cumuler les trois types de modules mentionnés plus haut et les destiner à des machines physiques différentes. C'est ça, ta configuration. 

Dans mon cas, ma configuration comporte 1 serveur, un mac, un pc sous linux, une configuration qui permet de faire une clef bootable...

Elle importe donc nix-darwin pour le mac, nixos pour le reste, mais aussi `nix-cooker` pour gérer plusieurs thèmes différents, et home-manager pour gérer différents programmes en local. 

Ta configuration, c'est le répo dans lequel tu fais appel aux modules qui génèrent ou configurent ton système. 

La plupart des utilisateurs de `nix` ont une configuration, et savent de quoi on parle quand on dit "ta config". C'est la config pour les contrôler toutes.

![](/assets/kqqcNTebVCzJmjCUFz3L05VDlwm93XzNOOnv09ArQ3E=.gif)



**La trini**~~**x**~~**té**

Petit récap : 

* Les exécutables: nix, nixos-rebuild, nix-darwin, permettent d'évaluer les configurations, et de les transformer en un résultat. On les appelle avec en paramètre le code `nix` à évaluer, et ils le mettent en œuvre créant un exécutable, un shell, voire un OS ou encore un ensemble de configurations pour ton système.
* Les packages : des définitions Nix qui permettent de compiler et d'installer des programmes. On peut les utiliser de différentes façons, comme vu précédemment. Ils ne nécessitent pas d'utiliser de modules, on peut juste les installer avec le CLI nix, sur n'importe quelle machine, de façon éphémère (shell) ou définitive (profiles, config). L'unité phare sans laquelle on ne peut créer de package est une dérivation, qui décrit la construction, la configuration, et l'installation d'un programme pour le `nix` store. Évidemment, les packages sont l'issue d'un appel à la commande `nix`.
* Les modules : des bouts de code `nix` aussi, mais ceux-ci ont des options prévues pour rendre leur output personnalisable. Les modules permettent de décrire une partie de ton système. Leur output, un ensemble de fichiers, sera au moins en partie lié symboliquement ou copié à différents endroits de ton système pour y apporter des fonctionnalités.

![](/assets/7RifibU5VAQ__JwQDcFpRXlDIjJGXImvXH7P0tyJwXg=.png "Un schema de l'éco-système nix")



**Moi aussi, je veux nixer mon ordi !**

Nixer son ordi, c'est un processus qui prend du temps, et qui peut te mettre dans la sauce si tu te foires. Tu sais ce qu'on dit sur les premières fois...

Je peux tout à fait comprendre que ce soit intimidant. 

Ce qui est généralement conseillé, c'est le processus suivant : 

1. Utiliser `nix` uniquement sous forme de packages et de shells sur ta distro actuelle, en gardant ton workflow intact
2. Installer home-manager/nix-darwin si tu es intéressé par la configuration de ton système mais veux garder ton OS
3. Tu es devenu accroc à la reproduction ? Tu veux mettre un pied dans NixOS ? 
Deux façons de s'y mettre petit à petit sans s'auto saboter :
   1. Faire un serveur NixOS sur du vieux matos ou un VPS à 2 balles
   2. Faire une VM sur ta machine, et créer petit à petit une config avec laquelle tu te sens de travailler, avant de l'installer sur ta machine. 
4. Une fois l'étape précédente passée, t'es finito pipo, ton addiction au nixage ne peut plus être soignée. Tu vas passer 10 heures par semaine à configurer, tu le feras sans même y être forcé.



![](/assets/yBkWqdLlrHFOcikWDwPHgxp86C2ahH4V827PHJdJTS4=.jpeg)



**Une fois que j'ai nixé ma vie, je fais quoi ?&#x20;**

Bon alors ça y est, `nix` est entré dans ton ordi et l'espoir de ressentir la douce chaleur d'un être aimant est sorti de ta vie. Benvenue au club ! 🗿

En fonction de tes besoins, voire de tes goûts, certains modules sont utiles, voire même incontournables : 

* Disko permet de configurer la façon dont tu vas partitionner ton disque. Parfait pour ne pas faire la même manip sur des dizaines de PC que tu veux identiques, voire juste pour pas te BRISER LES DENTS sur `parted`.
* HJEM est une alternative minimaliste à home-manager.
* NVF permet de générer une configuration Neovim avec un module `nix`, sans avoir à passer des heures à rechercher des plugins, et avec des valeurs par défaut utilisables clef en main.
* Charpente te permet de gérer plusieurs hôtes qui partagent des modules, sans se casser les couilles avec des chaînes d'import complètement bancales.
* Impermanence te permet de monter des volumes au démarrage pour ne persister que ce que tu veux, et charger le reste de ton système en RAM. Ainsi, chaque fois que tu redémarres tout est remis à 0. Un véritable remède pour les obsessionnels compulsifs.
* Nixos-anywhere te permet d'installer NixOS depuis une connexion SSH sur à peu près n'importe quoi. Avec ça, tous les cloud proposent des VPS sous NixOS, c'est qu'une question de temps.



Pour trouver une chaussure à ton pied, je n'ai pas mieux à te conseiller que de regarder par toi-même [cette liste.](https://github.com/nix-community/awesome-nix)



Alors voilà, c'est fini pour aujourd'hui. Tu t'attendais peut-être à voir du code dans cet article, mais cette série est là pour t'aider à comprendre ce qu'est `nix` et pourquoi c'est utile.



Dans une autre série, on verra des exemples de code dont tu pourras t'inspirer pour tes propres nixeries.



En attendant, j'aimerais qu'on parle à nouveau un peu de vie privée et peut-être même de vie tout court. 

Face à des conjonctures qui t'encouragent à perdre ton agentivité dans le monde, ton contrôle sur ta propre personne, et à aseptiser tout ce qui fait de toi un humain et un adulte, il faut raisonner sur la question de la liberté et s'y accrocher comme un bernacle à son rocher.



Prends soin de toi, fais du sport, et n’oublie pas de toucher de l’herbe cette semaine.
