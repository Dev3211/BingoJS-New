-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2019 at 10:54 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bingo`
--

-- --------------------------------------------------------

--
-- Table structure for table `buddies`
--

CREATE TABLE `buddies` (
  `IDD` int(11) NOT NULL,
  `ID` int(11) NOT NULL,
  `PlayerID` int(11) NOT NULL,
  `username` varchar(300) NOT NULL,
  `buddyID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `furnitures`
--

CREATE TABLE `furnitures` (
  `ID` int(11) NOT NULL,
  `PlayerID` int(11) NOT NULL,
  `FurnitureID` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `Quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `furnitures`
--

INSERT INTO `furnitures` (`ID`, `PlayerID`, `FurnitureID`, `username`, `Quantity`) VALUES
(1, 2, 1050, 'devvv', 5),
(2, 1, 587, 'devv', 1),
(3, 1, 136, 'devv', 1),
(4, 1, 638, 'devv', 1),
(5, 2, 1060, 'devvv', 5),
(6, 2, 660, 'devvv', 5),
(7, 2, 655, 'devvv', 5),
(8, 2, 656, 'devvv', 5),
(9, 2, 659, 'devvv', 5),
(10, 2, 607, 'devvv', 5),
(11, 2, 658, 'devvv', 4),
(12, 2, 475, 'devvv', 4),
(13, 2, 136, 'devvv', 4),
(14, 2, 657, 'devvv', 4),
(15, 2, 588, 'devvv', 4),
(16, 2, 587, 'devvv', 4),
(17, 2, 586, 'devvv', 4),
(18, 2, 651, 'devvv', 4),
(19, 2, 653, 'devvv', 4),
(20, 2, 650, 'devvv', 4),
(21, 2, 652, 'devvv', 4),
(22, 2, 154, 'devvv', 4),
(23, 2, 377, 'devvv', 4),
(24, 2, 378, 'devvv', 4),
(25, 2, 43, 'devvv', 4),
(26, 2, 649, 'devvv', 1),
(27, 2, 644, 'devvv', 1),
(28, 2, 643, 'devvv', 1),
(29, 2, 115, 'devvv', 1),
(30, 2, 119, 'devvv', 1),
(31, 2, 110, 'devvv', 1);

-- --------------------------------------------------------

--
-- Table structure for table `igloo`
--

CREATE TABLE `igloo` (
  `ID` int(11) NOT NULL,
  `OwnerID` int(11) NOT NULL,
  `Type` int(11) NOT NULL DEFAULT '0',
  `Music` int(11) NOT NULL DEFAULT '0',
  `Floor` int(11) NOT NULL DEFAULT '0',
  `Furniture` varchar(300) NOT NULL DEFAULT '0',
  `Locked` varchar(300) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `igloo`
--

INSERT INTO `igloo` (`ID`, `OwnerID`, `Type`, `Music`, `Floor`, `Furniture`, `Locked`) VALUES
(1, 1, 0, 235, 0, '587|380|380|1|1,', '1'),
(2, 2, 16, 0, 0, '378|473|384|1|1,588|380|400|1|1,644|247|367|1|1,115|458|414|1|1,657|472|164|2|1,652|383|187|2|1,136|283|228|2|1,643|469|227|2|1,119|434|361|1|1,154|301|357|1|1,154|534|343|1|1,587|547|413|1|1,586|289|391|1|1,', '1'),
(3, 111, 0, 0, 0, '0', '1'),
(4, 112, 0, 0, 0, '0', '1'),
(5, 333, 0, 0, 0, '0', '1');

-- --------------------------------------------------------

--
-- Table structure for table `ignored`
--

CREATE TABLE `ignored` (
  `IDD` int(11) NOT NULL,
  `ID` int(11) NOT NULL,
  `PlayerID` int(11) NOT NULL,
  `username` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `ID` int(11) NOT NULL,
  `PlayerID` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `itemID` int(11) NOT NULL,
  `used` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`ID`, `PlayerID`, `username`, `itemID`, `used`) VALUES
(1, 2, 'devvv', 347, 1),
(2, 2, 'devvv', 5, 1),
(3, 2, 'devvv', 13, 1),
(4, 2, 'devvv', 6, 1),
(5, 333, 'dev3', 362, 1),
(6, 2, 'devvv', 362, 1),
(7, 2, 'devvv', 373, 1),
(8, 2, 'devvv', 465, 1),
(9, 2, 'devvv', 446, 1),
(10, 2, 'devvv', 297, 1),
(11, 2, 'devvv', 211, 1),
(12, 2, 'devvv', 205, 1),
(13, 2, 'devvv', 439, 1),
(14, 2, 'devvv', 209, 1),
(15, 2, 'devvv', 376, 1),
(16, 2, 'devvv', 338, 1),
(17, 2, 'devvv', 234, 1),
(18, 2, 'devvv', 180, 1),
(19, 2, 'devvv', 117, 1),
(20, 2, 'devvv', 492, 1),
(21, 2, 'devvv', 361, 1),
(22, 2, 'devvv', 494, 1),
(23, 2, 'devvv', 481, 1),
(24, 2, 'devvv', 114, 1),
(25, 2, 'devvv', 293, 1),
(26, 2, 'devvv', 271, 1);

-- --------------------------------------------------------

--
-- Table structure for table `server`
--

CREATE TABLE `server` (
  `population` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `server`
--

INSERT INTO `server` (`population`) VALUES
(0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(100) NOT NULL,
  `user` varchar(300) NOT NULL,
  `password` varchar(400) NOT NULL,
  `loginkey` varchar(300) NOT NULL,
  `muted` int(11) DEFAULT '0',
  `banned` varchar(300) NOT NULL DEFAULT '0',
  `coins` varchar(300) NOT NULL DEFAULT '0',
  `rank` int(11) NOT NULL DEFAULT '0',
  `color` int(11) NOT NULL,
  `head` int(11) NOT NULL,
  `face` int(11) NOT NULL,
  `neck` int(11) NOT NULL,
  `body` int(11) NOT NULL,
  `hand` int(11) NOT NULL,
  `feet` int(11) NOT NULL,
  `flag` int(11) NOT NULL,
  `photo` int(11) NOT NULL,
  `igloos` varchar(100) NOT NULL DEFAULT '1',
  `registrationdate` int(11) NOT NULL DEFAULT '0',
  `moderator` int(11) NOT NULL DEFAULT '0',
  `online` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `user`, `password`, `loginkey`, `muted`, `banned`, `coins`, `rank`, `color`, `head`, `face`, `neck`, `body`, `hand`, `feet`, `flag`, `photo`, `igloos`, `registrationdate`, `moderator`, `online`) VALUES
(2, 'devvv', '4297f44b13955235245b2497399d7a93', '', 0, '0', '480107', 6, 5, 439, 0, 0, 271, 0, 0, 0, 0, '1|33|12|30|16', 0, 1, 0),
(112, 'devv', '4297f44b13955235245b2497399d7a93', '', 0, '1549449982', '-23122598912961', 1, 4, 0, 0, 313, 0, 347, 372, 0, 0, '', 1548253828, 0, 0),
(333, 'dev3', '4297f44b13955235245b2497399d7a93', '', 0, '0', '-200', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '1|', 0, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buddies`
--
ALTER TABLE `buddies`
  ADD PRIMARY KEY (`IDD`);

--
-- Indexes for table `furnitures`
--
ALTER TABLE `furnitures`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `igloo`
--
ALTER TABLE `igloo`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `ignored`
--
ALTER TABLE `ignored`
  ADD PRIMARY KEY (`IDD`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID` (`ID`);

--
-- Indexes for table `server`
--
ALTER TABLE `server`
  ADD UNIQUE KEY `population` (`population`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buddies`
--
ALTER TABLE `buddies`
  MODIFY `IDD` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `furnitures`
--
ALTER TABLE `furnitures`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `igloo`
--
ALTER TABLE `igloo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ignored`
--
ALTER TABLE `ignored`
  MODIFY `IDD` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=334;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
