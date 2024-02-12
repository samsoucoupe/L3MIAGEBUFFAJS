# Jeu Candy Crush avec DOM

## Introduction
Ce jeu est une implémentation simple du célèbre jeu Candy Crush, réalisée en utilisant le DOM (Document Object Model) pour la manipulation des éléments HTML. 
C'est un travail pratique réalisé dans le cadre du cours "Analyse des besoins et développement Web" de Mr Michel Buffa accompagné de Mr Quere et Mr Robert.

## Fonctionnalités principales

- **Grille de jeu dynamique :** La grille de jeu est générée dynamiquement à chaque niveau, offrant une variété de configurations de bonbons à chaque partie.

- **Mécanique de jeu familière :** Les joueurs peuvent sélectionner et échanger des bonbons adjacents pour créer des alignements de 3 ou plus, ce qui les fait disparaître et leur attribue des points.

- **Alignement :** Dans notre projet, le système de vérification d'alignement de bonbons fonctionne en parcourant la grille de jeu pour détecter des séquences consécutives de trois bonbons identiques dans les lignes et les colonnes.
Initialement prévu que dans les colonnes, le système a été modifié après conseil de Mr Quere.

- **Gestion des niveaux :** Le jeu propose une progression de niveau, avec une augmentation de la difficulté à mesure que le joueur progresse. Un niveau est atteint dès que le score dépasse ou atteint le seuil requis pour passer au niveau suivant, lequel est calculé en ajoutant 100 points multipliés par le niveau actuel au seuil précédent. Chaque passage de niveau réinitialise également le timer.

- **Gestion du temps :** Une minuterie est intégrée au jeu, offrant une contrainte de temps pour chaque niveau. Le jeu se termine si le temps imparti est écoulé.

- **Effets sonores :** Le jeu est accompagné d'effets sonores pour les interactions avec les bonbons et en fond musical.

## Utilisation

1. Ouvrez le fichier `index.html` dans un navigateur web compatible avec JavaScript.
2. Cliquez sur le bouton "START" pour lancer le jeu.
3. Sélectionnez et échangez des bonbons adjacents pour créer des alignements de 3 ou plus et marquer des points.
4. Atteignez le score requis pour passer au niveau suivant avant que le temps imparti ne s'épuise.
5. Amusez-vous bien !

Ce travail a été réalisé par Samy Ben Dhiab et Alex Armatys.
