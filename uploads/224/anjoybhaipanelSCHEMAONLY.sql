-- MySQL dump 10.13  Distrib 5.7.35, for Win64 (x86_64)
--
-- Host: localhost    Database: anjoybhaipanel
-- ------------------------------------------------------
-- Server version	5.7.35-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mypanel`
--

DROP TABLE IF EXISTS `mypanel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mypanel` (
  `SL` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `IP_DB` varchar(20) NOT NULL,
  `NAS_DRIVE` enum('yes','no','pending') DEFAULT NULL,
  `Replication` enum('yes','no','pending') DEFAULT NULL,
  `Monitoring_Panel` enum('yes','no','pending') DEFAULT NULL,
  `Remote_root_disable` enum('yes','no','pending') DEFAULT NULL,
  `Point_in_time_recovery` enum('yes','no','pending','no(configuration db)') DEFAULT NULL,
  `Mysql_Config_Backup` enum('yes','no','pending') DEFAULT NULL,
  `DB_BACKUP` enum('yes','no','pending') DEFAULT NULL,
  `User_Previleges` enum('yes','no','pending') DEFAULT NULL,
  `Primary_Backup_Location` varchar(100) DEFAULT NULL,
  `Secondary_Backup_Location` varchar(100) DEFAULT NULL,
  `Audit_Log` enum('yes','no','pending','no(disk space issue)') DEFAULT NULL,
  `Audit_Log_File` varchar(100) DEFAULT NULL,
  `CONFIG_FILE` longtext,
  `SCHEMA` longtext,
  `Remarks` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`SL`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-15 16:04:11
