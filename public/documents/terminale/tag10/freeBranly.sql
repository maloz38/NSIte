-- Requete 1 : 
CREATE TABLE villes  (
    id_town INTEGER PRIMARY KEY,
    metropole TEXT,
    population INTEGER
) ;

-- Requete 2 : 
CREATE TABLE utilisateurs  (
    id_user INTEGER PRIMARY KEY ,
    nom TEXT,
    prenom TEXT,
    genre TEXT,
    age INTEGER,
    id_towns INTEGER,
    FOREIGN KEY(id_towns) REFERENCES villes(id_town)
) ;

-- Requete 3 : 
INSERT INTO villes VALUES 
(1,'LYON',513000),
(2,'PARIS',2161000),
(3,'MARSEILLE',861000),
(4,'MACON',33000);

-- on peut aussi écrire en spécifiant la liste des attributs de la table : 
INSERT INTO villes(id_town,metropole,population) VALUES 
(1,'LYON',513000),
(2,'PARIS',2161000),
(3,'MARSEILLE',861000),
(4,'MACON',33000);

-- Requete 4 :
INSERT INTO utilisateurs(id_user,nom,prenom,genre,age,id_towns) VALUES 
(1,'Chouhan','Jean','homme',50,1),
(2,'Durand','Louis','homme',37,1),
(3,'GranJean','Alice','femme',45,2),
(4,'Bobet','Louison','homme',27,3);

-- Requete 5 :
INSERT INTO utilisateurs VALUES 
(5,'Champin','Arnaud','homme',23,1);

-- Requete 6 :
UPDATE utilisateurs SET age = 83 WHERE nom = 'Durand';

-- Requete 7 :
SELECT * FROM villes;

-- Requete 8 :
SELECT metropole FROM villes
WHERE population > 500000;

-- Requete 9 :
SELECT metropole FROM villes
WHERE metropole LIKE '%R%';

-- Requete 10 :
SELECT prenom , age FROM utilisateurs
WHERE genre = 'homme';

-- Requete 11 :
SELECT SUM(age) AS somme_age FROM utilisateurs;

-- Requete 12 :
SELECT COUNT(*) AS nb FROM utilisateurs;

-- Requete 13 :
SELECT AVG(age) AS ageMoyen FROM utilisateurs;

-- Requete 14 :
SELECT MAX(age) AS age_maxi FROM utilisateurs;

-- Requete 15 :
CREATE TABLE maTable  (
    id INTEGER 
) ;
DROP TABLE maTable;

-- Requete 16 :
SELECT nom,prenom FROM utilisateurs
JOIN villes ON utilisateurs.id_towns = villes.id_town
WHERE metropole = 'LYON';

-- Requete 17 :
SELECT u.nom,u.prenom, v.population FROM villes AS v
JOIN utilisateurs AS u ON v.id_town = u.id_towns
WHERE u.nom = 'Durand'

-- Requete 18 :
SELECT u.nom,u.prenom , v.metropole FROM utilisateurs AS u
JOIN villes AS v ON u.id_towns = v.id_town
WHERE v.population > 1000000

-- Requete 19 :
SELECT * FROM villes AS v
LEFT JOIN utilisateurs AS u ON  v.id_town = u.id_towns

-- Requete 20 :
SELECT * FROM villes AS v
JOIN utilisateurs AS u ON  v.id_town = u.id_towns

-- Requete 21 :
DELETE FROM villes WHERE metropole = 'MACON'

-- Requete 22 :
DELETE FROM villes WHERE metropole = 'MARSEILLE'