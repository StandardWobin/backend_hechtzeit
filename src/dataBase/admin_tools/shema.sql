-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: XXXXXX
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `relation_show_scene`
--

DROP TABLE IF EXISTS `relation_show_scene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relation_show_scene` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `show` varchar(100) DEFAULT NULL,
  `sceneAudience` int DEFAULT NULL,
  `sceneAPI` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `show_idx` (`show`),
  KEY `sceneApi_idx` (`sceneAPI`),
  KEY `sceneAudience` (`sceneAudience`),
  CONSTRAINT `sceneApi` FOREIGN KEY (`sceneAPI`) REFERENCES `scene` (`ID`),
  CONSTRAINT `sceneAudience` FOREIGN KEY (`sceneAudience`) REFERENCES `scene` (`ID`),
  CONSTRAINT `showLink` FOREIGN KEY (`show`) REFERENCES `show` (`link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relation_show_scene`
--

LOCK TABLES `relation_show_scene` WRITE;
/*!40000 ALTER TABLE `relation_show_scene` DISABLE KEYS */;
INSERT INTO `relation_show_scene` VALUES (1,'DEMO',1,1);
/*!40000 ALTER TABLE `relation_show_scene` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene`
--

DROP TABLE IF EXISTS `scene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `show` varchar(100) DEFAULT NULL,
  `owner` int DEFAULT NULL,
  `type` int NOT NULL DEFAULT '0',
  `created` date DEFAULT NULL,
  `order` int NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT 'Neue Scene',
  `live` tinyint DEFAULT '0',
  `show_eval` tinyint DEFAULT '0',
  `disabled` tinyint DEFAULT '0',
  `countdown` int DEFAULT '0',
  `cooldown` int DEFAULT '0',
  `reuse` tinyint DEFAULT '1',
  `countdownstart` varchar(100) DEFAULT '0',
  `moderate` tinyint DEFAULT '0',
  `feedbackuntil` datetime DEFAULT '0000-00-00 00:00:00',
  `customStageNumber` int DEFAULT '-1',
  PRIMARY KEY (`ID`),
  KEY `ownership_idx` (`owner`),
  KEY `show_idx` (`show`),
  CONSTRAINT `show` FOREIGN KEY (`show`) REFERENCES `show` (`link`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `showowner` FOREIGN KEY (`owner`) REFERENCES `user` (`ID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=358 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene`
--

LOCK TABLES `scene` WRITE;
/*!40000 ALTER TABLE `scene` DISABLE KEYS */;
INSERT INTO `scene` VALUES (1,'DEMO',1,0,NULL,0,'Demo Information',0,1,0,0,0,1,'0',0,'2022-11-21 14:22:01',-1),(351,'DEMO',1,1,'2023-05-21',1,'Demo Umfrage',0,0,0,0,0,1,'0',0,'0000-00-00 00:00:00',-1),(352,'DEMO',1,2,'2023-05-21',2,'Demo Slider',0,0,0,0,0,1,'0',0,'0000-00-00 00:00:00',-1),(353,'DEMO',1,3,'2023-05-21',3,'Demo Knopf',0,0,0,22,21,1,'0',0,'0000-00-00 00:00:00',-1),(354,'DEMO',1,4,'2023-05-21',4,'Demo Painting',0,0,0,0,0,1,'0',0,'0000-00-00 00:00:00',-1),(355,'DEMO',1,6,'2023-05-21',5,'Demo Texter',0,0,0,0,0,1,'0',0,'0000-00-00 00:00:00',-1),(356,'DEMO',1,5,'2023-05-21',6,'Demo Sprachnachricht',0,0,0,0,0,1,'0',0,'0000-00-00 00:00:00',-1);
/*!40000 ALTER TABLE `scene` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_imageup`
--

DROP TABLE IF EXISTS `scene_content_imageup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_imageup` (
  `ID_imageup` int NOT NULL,
  `global_scene_id` int DEFAULT NULL,
  `title_imageup` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID_imageup`),
  UNIQUE KEY `ID_imageup_UNIQUE` (`ID_imageup`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  KEY `id_imageup_idx` (`global_scene_id`),
  CONSTRAINT `id_imageup` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_imageup`
--

LOCK TABLES `scene_content_imageup` WRITE;
/*!40000 ALTER TABLE `scene_content_imageup` DISABLE KEYS */;
/*!40000 ALTER TABLE `scene_content_imageup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_mc`
--

DROP TABLE IF EXISTS `scene_content_mc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_mc` (
  `ID_mc` int NOT NULL AUTO_INCREMENT,
  `global_scene_id` int DEFAULT NULL,
  `title_mc` varchar(45) DEFAULT 'Frage',
  `size_mc` int DEFAULT '0',
  `text_mc` varchar(100) DEFAULT 'Text unterhalb der Umfrage',
  `answer_text_1` varchar(45) DEFAULT 'Erste Antwort',
  `answer_text_2` varchar(45) DEFAULT 'Zweite Anwtort',
  `answer_text_3` varchar(45) DEFAULT 'Dritte Antwort',
  `answer_text_4` varchar(45) DEFAULT 'Vierte Antwort',
  `answer_text_5` varchar(45) DEFAULT 'Fünfte Antwort',
  `answer_text_6` varchar(45) DEFAULT 'Sechte Antwort',
  `sendbuttontext` varchar(45) DEFAULT 'Text auf dem Senden Button',
  `type_mc` int DEFAULT '0',
  PRIMARY KEY (`ID_mc`),
  UNIQUE KEY `ID_mc_UNIQUE` (`ID_mc`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  KEY `id_idx` (`global_scene_id`),
  CONSTRAINT `id_mc` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_mc`
--

LOCK TABLES `scene_content_mc` WRITE;
/*!40000 ALTER TABLE `scene_content_mc` DISABLE KEYS */;
INSERT INTO `scene_content_mc` VALUES (1,351,'Frage',4,'Text unterhalb der Umfrage','Erste Antwort','Zweite Anwtort','Dritte Antwort','Vierte Antwort','Fünfte Antwort','Sechte Antwort','Text auf dem Senden Button',0);
/*!40000 ALTER TABLE `scene_content_mc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_noop`
--

DROP TABLE IF EXISTS `scene_content_noop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_noop` (
  `ID_noop` int NOT NULL AUTO_INCREMENT,
  `global_scene_id` int NOT NULL,
  `title_noop` varchar(45) DEFAULT 'Titel',
  `icon_noop` varchar(45) DEFAULT 'hand-wave',
  `text_noop` varchar(100) DEFAULT 'Text unterhalb des Titels',
  PRIMARY KEY (`ID_noop`,`global_scene_id`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  UNIQUE KEY `ID_noop_UNIQUE` (`ID_noop`),
  KEY `id_idx` (`global_scene_id`),
  CONSTRAINT `id` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_noop`
--

LOCK TABLES `scene_content_noop` WRITE;
/*!40000 ALTER TABLE `scene_content_noop` DISABLE KEYS */;
INSERT INTO `scene_content_noop` VALUES (1,1,'Titel','hand-wave','Das ist eine Demonstation'),(2,351,'Titel','hand-wave','Text unterhalb des Titels'),(3,352,'Titel','hand-wave','Text unterhalb des Titels'),(4,355,'Titel','hand-wave','Text unterhalb des Titels'),(5,356,'Titel','hand-wave','Text unterhalb des Titels');
/*!40000 ALTER TABLE `scene_content_noop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_painter`
--

DROP TABLE IF EXISTS `scene_content_painter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_painter` (
  `ID_painter` int NOT NULL AUTO_INCREMENT,
  `global_scene_id` int DEFAULT NULL,
  `title_painter` varchar(45) DEFAULT 'Überschrift',
  `text_painter` varchar(45) DEFAULT 'male doch mal was',
  `button_text_painter` varchar(45) DEFAULT 'enter',
  PRIMARY KEY (`ID_painter`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  KEY `id_painter_idx` (`global_scene_id`),
  CONSTRAINT `id_painter` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_painter`
--

LOCK TABLES `scene_content_painter` WRITE;
/*!40000 ALTER TABLE `scene_content_painter` DISABLE KEYS */;
INSERT INTO `scene_content_painter` VALUES (1,354,'Überschrift','male doch mal was','enter');
/*!40000 ALTER TABLE `scene_content_painter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_pusher`
--

DROP TABLE IF EXISTS `scene_content_pusher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_pusher` (
  `ID_pusher` int NOT NULL AUTO_INCREMENT,
  `global_scene_id` int DEFAULT NULL,
  `title_pusher` varchar(45) DEFAULT 'Überschrift',
  `text_pusher` varchar(45) DEFAULT 'Drück was',
  `icon_1_pusher` varchar(45) DEFAULT 'smoking',
  `icon_2_pusher` varchar(45) DEFAULT 'smoking',
  `icon_3_pusher` varchar(45) DEFAULT 'smoking',
  `icon_4_pusher` varchar(45) DEFAULT 'smoking',
  `avg_text_pusher` varchar(45) DEFAULT 'Durchschnitt',
  `size_pusher` int DEFAULT '2',
  PRIMARY KEY (`ID_pusher`),
  UNIQUE KEY `ID_pusher_UNIQUE` (`ID_pusher`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  KEY `id_pusher_idx` (`global_scene_id`),
  CONSTRAINT `id_pusher` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_pusher`
--

LOCK TABLES `scene_content_pusher` WRITE;
/*!40000 ALTER TABLE `scene_content_pusher` DISABLE KEYS */;
INSERT INTO `scene_content_pusher` VALUES (1,353,'Überschrift','Drück was','mdi mdi-access-point','smoking','smoking','smoking','Durchschnitt',1);
/*!40000 ALTER TABLE `scene_content_pusher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_slider`
--

DROP TABLE IF EXISTS `scene_content_slider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_slider` (
  `ID_slider` int NOT NULL AUTO_INCREMENT,
  `global_scene_id` int DEFAULT NULL,
  `title_slider` varchar(100) DEFAULT 'Ich bin ein Slider',
  `text_top_slider` varchar(75) DEFAULT 'Erklärtext überm Slider',
  `text_bot_slider` varchar(75) DEFAULT 'Erklärtext unterm Slider',
  `border_text_left_slider` varchar(45) DEFAULT 'Linker Rand vom Slider',
  `border_text_right_slider` varchar(45) DEFAULT 'Rechter Rand vom Slider',
  `avg_text_slider` varchar(45) DEFAULT 'Text bei Publikumsvote',
  `vertical` tinyint DEFAULT '1',
  `startvalue` double DEFAULT '0.5',
  PRIMARY KEY (`ID_slider`),
  UNIQUE KEY `ID_slider_UNIQUE` (`ID_slider`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  KEY `id_idx` (`global_scene_id`),
  CONSTRAINT `id_slider` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_slider`
--

LOCK TABLES `scene_content_slider` WRITE;
/*!40000 ALTER TABLE `scene_content_slider` DISABLE KEYS */;
INSERT INTO `scene_content_slider` VALUES (1,352,'Titel','Oben','Unten','Links','Rechts','label',NULL,37);
/*!40000 ALTER TABLE `scene_content_slider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_texter`
--

DROP TABLE IF EXISTS `scene_content_texter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_texter` (
  `ID_texter` int NOT NULL AUTO_INCREMENT,
  `global_scene_id` int DEFAULT NULL,
  `title_texter` varchar(45) DEFAULT NULL,
  `big_texter` tinyint DEFAULT '0',
  PRIMARY KEY (`ID_texter`),
  UNIQUE KEY `ID_texter_UNIQUE` (`ID_texter`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  KEY `id_voicer_idx` (`global_scene_id`),
  CONSTRAINT `id_texter` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_texter`
--

LOCK TABLES `scene_content_texter` WRITE;
/*!40000 ALTER TABLE `scene_content_texter` DISABLE KEYS */;
INSERT INTO `scene_content_texter` VALUES (1,355,NULL,1);
/*!40000 ALTER TABLE `scene_content_texter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_content_voicer`
--

DROP TABLE IF EXISTS `scene_content_voicer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_content_voicer` (
  `ID_voicer` int NOT NULL AUTO_INCREMENT,
  `global_scene_id` int DEFAULT NULL,
  `title_voicer` varchar(45) DEFAULT NULL,
  `text_voicer` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_voicer`),
  UNIQUE KEY `ID_mc_UNIQUE` (`ID_voicer`),
  UNIQUE KEY `global_scene_id_UNIQUE` (`global_scene_id`),
  KEY `id_voicer_idx` (`global_scene_id`),
  CONSTRAINT `id_voicer` FOREIGN KEY (`global_scene_id`) REFERENCES `scene` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_content_voicer`
--

LOCK TABLES `scene_content_voicer` WRITE;
/*!40000 ALTER TABLE `scene_content_voicer` DISABLE KEYS */;
INSERT INTO `scene_content_voicer` VALUES (1,356,'Titel',NULL);
/*!40000 ALTER TABLE `scene_content_voicer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_responses`
--

DROP TABLE IF EXISTS `scene_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scene_responses` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `show` varchar(45) DEFAULT NULL,
  `scene` int DEFAULT NULL,
  `scenetype` int DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `socketid` varchar(45) DEFAULT NULL,
  `agent` varchar(200) DEFAULT NULL,
  `datecon` datetime(2) DEFAULT NULL,
  `datainit` varchar(300) DEFAULT NULL,
  `global_scene_id` int DEFAULT NULL,
  `message` mediumtext,
  `token` varchar(1000) DEFAULT NULL,
  `needmod` tinyint DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `id_UNIQUE` (`ID`),
  KEY `global_scene_idx` (`scene`),
  KEY `global_show_idx` (`show`),
  CONSTRAINT `global_scene` FOREIGN KEY (`scene`) REFERENCES `scene` (`ID`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `global_show` FOREIGN KEY (`show`) REFERENCES `show` (`link`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_responses`
--

LOCK TABLES `scene_responses` WRITE;
/*!40000 ALTER TABLE `scene_responses` DISABLE KEYS */;
/*!40000 ALTER TABLE `scene_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `show`
--

DROP TABLE IF EXISTS `show`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `show` (
  `link` varchar(100) NOT NULL,
  `owner` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `lastmod` datetime NOT NULL,
  `online` tinyint DEFAULT '0',
  `offline_name` varchar(100) DEFAULT 'Fernbedienung',
  `offline_text` varchar(100) DEFAULT 'Diese Show hat noch nicht gestartet.',
  `title_image` varchar(100) DEFAULT 'default.png',
  `api_key` varchar(45) DEFAULT NULL,
  `stream_link` varchar(200) DEFAULT 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  PRIMARY KEY (`link`),
  UNIQUE KEY `link_UNIQUE` (`link`),
  KEY `user` (`owner`),
  CONSTRAINT `user` FOREIGN KEY (`owner`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `show`
--

LOCK TABLES `show` WRITE;
/*!40000 ALTER TABLE `show` DISABLE KEYS */;
INSERT INTO `show` VALUES ('DEMO',1,'Das ist eine Demonstation','2022-10-18 00:18:20',1,'Demonstationstext','Diese Show hat noch nicht gestartet.','default.png','null','https://www.youtube.com/embed/QH2-TGUlwu4');
/*!40000 ALTER TABLE `show` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `idtokens` int NOT NULL AUTO_INCREMENT,
  `tokenvalue` varchar(200) NOT NULL,
  `tokencreated` datetime NOT NULL,
  `tokenexp` datetime NOT NULL,
  `owner` int NOT NULL,
  UNIQUE KEY `idtokens_UNIQUE` (`idtokens`),
  KEY `user_idx` (`owner`),
  CONSTRAINT `ownerkexy` FOREIGN KEY (`owner`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (1,'X','2023-05-21 16:57:50','2023-05-22 16:57:50',1);
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `DOB` datetime DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `actshow` int unsigned DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test','test','2022-05-06 21:54:26','test@test.de',NULL),(2,'Petwer','peter','2022-05-06 21:54:26','peter@peter.de',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-21 17:06:54
