---
title: "Nixer !?"
date: 2026-02-10T00:00:00+05:30
draft: false
tldr: "Premier contact avec la reproduction."
series: "Nixer ou l'art de la reproduction"
index: 1
---

Bienvenue dans cette - *je l'éspère -&#x20;*&#x6C;ongue et régulière série d'articles sur la miraculeuse technologie qui porte le nom de Nix.  

Nix, c'est le seul et unique moyen d'intéresser les aptères aux cheveux bleus et les femmes à barbes du cirque Pindère, à la reproduction.  

Non, je ne vais pas parler ici des services de locations d'utérus du tiers monde avec option livraison FedEx.  
Alors, ça te donne envie de te reproduire, hein ? HEIN !?   

Trêve de plaisanterie. Qu'est-ce que Nix ?   

En 2003, un nouveau gestionnaire de paquets est inventé par Eelco Dolstra, un génie dont le nom a été sali par les clowns mentionnés à l'intro (si t'es curieux, regarde [cet article](https://srid.ca/nixos-woke); il décrit ce qui a mené à [une alternative politisée de Nix](https://lix.systems/about/#why-lix) qui, somme-toute, me semble très bien d'un point de vue technique).   

L'idée de Nix est un gestionnaire de paquets stable, qui fonctionne sur toutes les distributions Linux et de nombreuses architectures, avec un système de fichiers en `lecture seule`, où les paquets existent en parallèle les uns des autres, identifiés avec des hashs générés en fonction de leur contenu.   

C'est aussi un écosystème entier basé sur le principe des "Trucs as Code", une mode salvatrice qui consiste à rendre tout configurable par le biais de simples fichiers de configuration ressemblant plus ou moins à du code. Si j'étais un petit rigolo, je dirais qu'il s'agit d'un retour aux sources ! ☝️🤓   

Ainsi, chaque paquet peut satisfaire ses dépendances sans créer de conflits.  

Par exemple, si tu as besoin de Python `3.15` et Python `3.14` à la fois, pour deux programmes dfférents, tu n'auras pas de conflit entre ces deux-ci, qui auront chacun un hash associé dans `/nix/store`.   

De la même manière, si deux programmes nécessitent Python `3.15`, ils partageront le même dossier d'installation pour cette dépendance, qu'ils trouveront grâce à son hash.  

Nix garantit aussi une certaine stabilité grâce à la façon dont ses paquets sont créés.   

Une `derivation`, structure de base d'un paquet Nix, est construite dans un environnement encapsulé qui doit être délibérément et précisément décrit dans une configuration écrite dans le `langage nix`.  Grâce à ça, le paquet se compilera toujours de la même manière indépendamment de la machine hôte. On parle ici de `pureté`, car l'environnement de compilation et de préparation des programmes n'interagit absolument pas avec le système d'exploitation hôte.  

&#x20;Une telle façon de créer des paquets prémunit les utilisateurs de problèmes du type   

> "ben j'comprends pô, ça marche sur ma machine... T'as bien écrit 'localhost:8543' dans ta barre d'URL ?"   

![](/assets/4-MrB3yeFcFx-R95g8sBk4DUSqvgH1UrTNi0PVCEFwo=.png "Eminem ne comprend pas pourquoi ça ne marche pas sur sa machine")

En partant de ces principes, nix est très intéressant :   

* En termes de sécurité, le Nix store en lecture seule est un énorme plus. Personne ne peut glisser d'exécutables douteux au milieu des programmes déjà présents (à nuancer, mais on en parlera plus tard !) 
* Pour les schizo obsédés de la compilation en local, Nix remplis leurs critères en compilant sur le métal, dans un environnement isolé  


C'est juste l'échauffement, il y a plus !   

Nix, c'est aussi un langage de programmation à part entière, qui permet de créer plus que de simples paquets.   

Il permet aussi de créer des environnements de shell éphémères.  

Ceux-ci te permettront de :
* Tester des programmes sans les installer  
* Créer des environnements reproductibles de A à Z pour le développement d'une application  


C'est bien beau ces promesses, mais en quoi est-ce que ça peut t'aider toi ?   


Imagine, tu gères une équipe de développeurs sur un projet techniquement complexe à mettre en place. On a tous déjà perdu 3 jours de travail à essayer de mettre en place un environnement de travail pour un job, et maudit notre métier tout en noyant notre PC dans des installations et configurations qui laisseront un bordel digne du dernier mandat de Trump...   

Avec un shell Nix, le nouveau stagiaire a juste à installer `nix` et à taper la commande `nix develop` dans le projet sur lequel il va dev.  

Tout fonctionne après ça ! Je te laisse imaginer ce que ça permet pour les projets open source.   

C'est presque trop beau pour être vrai. 🥺  


Mais ce n'est pas tout, car Nix permet aussi de définir un système d'exploitation dans un état reproductible.   

Si cette fois, on ne parle pas d'une start-up fringante mais d'un établissement de notre dégringolante éducation nationale, il peut y avoir des milliers de postes à gérer (et pas toujours frais, les postes, hein...).   


NixOS permet de définir une configuration qui sera installée sur chacun de ces postes, de façon fiable, avec les barrières nécessaires, et un système d'exploitation cumulan&#x74;**&#x20;lecture seule** et **ramfs**. Ainsi, ce dernier sera rétabli à chaque reboot et offrira un contrôle tellement granulaire qu'en allumant les ordis du CDI tu entendras retentir le bruit des bottes les plus sombres depuis le moniteur cathodique.  

On parlera de comment mettre tout ça en œuvre dans de futurs articles.  

Parfois, il s'agit d'une université d'informatique, et les élèves ont besoin d'outils divers et variés pour leurs cours. Avec les shells ephémères, sans avoir besoin des droits adminsitrateur, c'est possible et même facile. C'est quand même bien fait, non ? 🤓  

Besoin de couper internet durant les examens, pour les forcer à utiliser la pâte à modeler Play-Doh que ChatGPT a façonnée avec leur cerveau ?   

C'est super facile de faire un cache binaire sur un serveur local qui intervient entre les postes et internet, et compile les paquets pour ceux-ci. Là aussi, un contrôle est possible sur les paquets autorisés.  

Autre situation : si tu es un gros nerd, tu as peut-être une collection de Lenovo ThinkPads et de Raspberry PI sur lesquels tu fais des choses différentes et peut-être même un serveur en datacenter sur lequel tu as l'habitude de te connecter en SSH.   

Tiens-toi bien, car tu peux :
* Mettre une partie de ta configuration Nix en commun pour chacun de tes postes, et avoir un environnement parfaitement synchronisé entre toutes tes machines et en même temps modulaire, pour désactiver certaines parties sur certaines machines.
* Avoir une config neovim compliquée, des alias avec des alternatives à ls, cp et autres dans ton shell. Tu peux aussi avoir un prompt avec une configuration très personnelle, ou que sais-je encore.
* Faire tourner un cluster Kubernetes ou Spark avec plein d'hôtes communiquants dont 90 % de la configuration est identique et 10 % est spécifique pour chaque hôte.

Tout ce qui est en commun ne sera écrit qu'une fois pour tous tes postes, avec une seule source de vérité.   

Si tout ça ne réveille pas chez toi un instinct de reproducteur, je ne sais pas ce qu'il te faut...   

Nix est un écosystème gigantesque et révolutionnaire dont on ne vient que d'effleurer la surface.    

S'il est sorti en 2003, alors pourquoi n'en as-tu pas entendu parler avant ? Eh bien, on va le voir plus tard, mais Nix est difficile à mettre en œuvre.   

Sa façon de packager les applications est bourrée de contraintes qui sont le contrecoup de la reproductibilité. Sans compter le langage Nix qui, bien que parfaitement adapté à son cas d'usage, est vraiment peu commun et assez mal documenté.  

Pour finir, en ce qui concerne NixOS, si tu fais partie de ces hipsters allergiques ~~au gluten~~ à `systemd`, (les gars vous en faites trop, calmez vous !!) sache que NixOS est entièrement basé sur les services `systemd`. Peut-être que `systemd` n'est vraiment pas une option, que tu ne peux pas nixer à cause de ça et que ça impliquerait de raser la barbe sur ton cou.  

Bonne nouvelle, tu peux au moins [sixer](https://codeberg.org/amjoseph/sixos), mais à partir de là, ça sort de ma juridiction, franchement, je ne veux même pas savoir.  

![](/assets/SFOQuzZ4FM1qjB7b3fnRFJVbPlGazPFfCuTTPvXndoA=.png "Toi si t'as cliqué sur le lien vers sixos")  

Pour que l'écosystème Nix devienne mature et présente le moindre intérêt dans la pratique, il a fallu un gigantesque travail durant ces deux décennies. Aujourd'hui, NixOS est assez populaire et vole même la vedette à Arch Linux.    

La base d'utilisateurs de Nix n'est probablement pas celle recherchée initialement : Nix est plutôt destiné aux admins systems qui gèrent des parcs informatiques, pas aux scripteurs à serre-tête oreilles de chat et chaussettes hautes qui volent des ~~dotfiles~~ pointfichiers sur GitHub pour agrémenter leur ~~rice~~ riz ~~Hyprland~~ Hyprterritoire.   

Pour ces derniers, et pour moi tout autant, ce système est largement au-delà de nos besoins. Cependant, cet engouement a été plus que bénéfique pour l'écosystème qui, grâce à toute cette attention, a pu se développer via l'intervention de nombreux contributeurs.  

![](/assets/-ZuQ7C-PJpF8_rWihuxWp7i8y1gIohlT6KhgQSZwBIs=.png "Contributions à nixpkgs de 2003 à 2026")

![](/assets/hIG4TROavCGRHiLcBRiqgPZhIf3SCPjNFRTAXHzLb5Y=.png "historique des stars données à nixpkgs sur github")


Si tu veux apprendre à utiliser cet outil merveilleux par toi-même, quelques ressources existent déjà et je ne peux que te conseiller [d'aller lire la doc](https://wiki.nixos.org/wiki/NixOS_Wiki/fr) !  

Comme tu pourras rapidement le constater, la documentation autour de Nix est sporadique et rarement à jour, mais c'est assez pour commencer et beaucoup d'autres gens ont fait des blogposts plus ou moins exhaustifs sur le sujet.   


En conclusion : Nix, c'est innovant, c'est stylé, mais c'est pas fait pour être une solution à tout.   

Pour chacun des avantages, il y a des défauts associés, qui sont doucement en train de se faire rabotter par la communauté grandissante.  

Je me fais peut-être des illusions, mais je pense que de plus en plus de DevOps vont être amenés à nixer.  


Cet article t'ayant **évidemment** mis l'eau à la bouche, tu t'es bien sûr déjà abonné au flux RSS sur la page principale... 🤓  

Et **bien évidemment**, tu es trépignant d'impatience à l'idée d'en apprendre plus sur l'art de nixer !  

Ne t'en fais pas, car tu seras servi avec les classes de maître qui suivront dans cette **épique&#x20;**&#x73;érie d'articles.  

À commencer par :  

* Une présentation plus concrète de Nix
  * 📦 Le gestionnaire de paquets 
  * 📜 Le langage 
  * 🖥️ Le système d'exploitation et autres modules pour gérer son système 
* Divers tutoriels pratico-pratiques pour devenir un maître de la reproduction
  * ❄️ Les flakes 
  * ∅ Impermanence 
  * 💾 Disko 
  * 📂 Les devshells de projets normaux   
  
  
Sur ce, je te laisse, je me sens envahi d'une irrépressible envie...  
  
  
Il faut impérativement que je nix. ❄️  


Prends soin de toi, fais du sport, et n’oublie pas de toucher de l’herbe cette semaine. 


