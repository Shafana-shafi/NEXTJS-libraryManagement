-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: lms_db:3306
-- Generation Time: Sep 18, 2024 at 06:46 AM
-- Server version: 9.0.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_db`
--
CREATE DATABASE IF NOT EXISTS `library_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `library_db`;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `author` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `publisher` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `genre` varchar(31) DEFAULT NULL,
  `isbnNo` varchar(13) DEFAULT NULL,
  `pages` int NOT NULL,
  `totalCopies` int NOT NULL,
  `availableCopies` int NOT NULL,
  `price` float NOT NULL,
  `imageUrl` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `publisher`, `genre`, `isbnNo`, `pages`, `totalCopies`, `availableCopies`, `price`, `imageUrl`) VALUES
(4, 'Python Programming in Context', 'Bradley N. Miller, David L. Ranum, Julie Anderson', 'Jones & Bartlett Learning', 'Computers', '9781284175554', 516, 352, 341, 200, NULL),
(5, 'Core Python Programming', 'Wesley Chun', 'Prentice Hall Professional', 'Computers', '9780130260369', 805, 3, 0, 909, NULL),
(9, 'Learning to Program 1', 'Steven Foote', 'Addison-Wesley Professional', 'Computers', '9780133795226', 336, 9, 2, 952, NULL),
(10, 'Guide to Competitive Programming 3', 'Antti Laaksonen', 'Springer', 'Computers', '9783319725475', 283, 12, 10, 129, NULL),
(11, 'The Pragmatic Programmer', 'Andrew Hunt, David Thomas', 'Addison-Wesley Professional', 'Computers', '9780132119177', 346, 6, 1, 396, NULL),
(12, 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Addison-Wesley Professional', 'Computers', '9780135956915', 390, 2, 2, 593, NULL),
(13, 'Data-Oriented Programming', 'Yehonathan Sharvit', 'Simon and Schuster', 'Computers', '9781617298578', 422, 7, 1, 775, NULL),
(14, 'A Book on C', 'Al Kelley, Ira Pohl', 'Benjamin-Cummings Publishing Company', 'Computers', '9780805300604', 548, 10, 2, 195, NULL),
(15, 'Getting Inside Java - Beginners Guide', 'Prem Kumar', 'Pencil', 'Computers', '9789354386459', 208, 6, 2, 351, NULL),
(16, 'Programming in C', 'Ashok N. Kamthane', '', 'C (Computer program language)', '9789380856421', 657, 8, 2, 168, NULL),
(17, 'Programming Fundamentals', 'Kenneth Leroy Busbee', '', 'Computers', '9789888407491', 340, 5, 2, 592, NULL),
(18, 'COMPUTER PROGRAMMING IN FORTRAN 77', 'V. RAJARAMAN', 'PHI Learning Pvt. Ltd.', 'Computers', '9788120311725', 212, 5, 2, 553, NULL),
(19, 'Elements of Programming', 'Alexander A. Stepanov, Paul McJones', 'Addison-Wesley Professional', 'Computers', '9780321635372', 279, 4, 2, 891, NULL),
(20, 'Programming in Lua', 'Roberto Ierusalimschy', 'Roberto Ierusalimschy', 'Computers', '9788590379829', 329, 10, 2, 894, NULL),
(21, 'Programming Persistent Memory', 'Steve Scargall', 'Apress', 'Computers', '9781484249321', 384, 2, 2, 796, NULL),
(22, 'Programming Problems', 'B. Green', 'Createspace Independent Pub', 'Computers', '9781475071962', 156, 9, 1, 296, NULL),
(23, 'Expert Python Programming', 'Michał Jaworski, Tarek Ziadé', 'Packt Publishing Ltd', 'Computers', '9781801076197', 631, 4, 2, 797, NULL),
(24, 'Practical Goal Programming', 'Dylan Jones, Mehrdad Tamiz', 'Springer Science & Business Media', 'Business & Economics', '9781441957719', 180, 9, 2, 295, NULL),
(25, 'Fundamentals of Computer Programming with C#', 'Svetlin Nakov, Veselin Kolev', 'Faber Publishing', 'Computers', '9789544007737', 1132, 8, 2, 785, NULL),
(26, 'Code', 'Charles Petzold', 'Microsoft Press', 'Computers', '9780137909292', 562, 11, 2, 240, NULL),
(27, 'Programming in Python 3', 'Mark Summerfield', 'Pearson Education', 'Computers', '9780321606594', 552, 5, 2, 545, NULL),
(28, 'Programming In C: A Practical Approach', 'Ajay Mittal', 'Pearson Education India', 'C (Computer program language)', '9788131729342', 768, 4, 0, 104, NULL),
(29, 'The C++ Programming Language', 'Bjarne Stroustrup', 'Pearson Education India', 'C++ (Computer program language)', '9788131705216', 1034, 6, 2, 588, NULL),
(30, 'Practical C++ Programming', 'Steve Oualline', '\"O\'Reilly Media, Inc.\"', 'Computers', '9781449367169', 576, 11, 2, 727, NULL),
(31, 'Programming Erlang', 'Joe Armstrong', 'Pragmatic Bookshelf', 'Computers', '9781680504323', 755, 8, 2, 869, NULL),
(32, 'Programming in Modula-3', 'Laszlo Böszörmenyi, Carsten Weich', 'Springer', 'Computers', '9783642646140', 571, 11, 2, 263, NULL),
(33, 'The History Book', 'DK', 'Dorling Kindersley Ltd', 'History', '9780241282229', 354, 8, 2, 411, NULL),
(34, 'The Lessons of History', 'Will Durant, Ariel Durant', 'Simon and Schuster', 'History', '9781439170199', 128, 3, 2, 264, NULL),
(35, 'The History Book', 'Dorling Kindersley Publishing Staff', '', 'History', '9780241225929', 0, 3, 2, 888, NULL),
(36, 'A Companion to the History of the Book', 'Simon Eliot, Jonathan Rose', 'John Wiley & Sons', 'Literary Criticism', '9781444356588', 617, 10, 2, 846, NULL),
(37, 'The American College and University', 'Frederick Rudolph', 'University of Georgia Press', 'Education', '9780820312842', 592, 3, 2, 566, NULL),
(38, 'That\'s Not in My American History Book', 'Thomas Ayres', 'Taylor Trade Publications', 'United States', '9781589791077', 257, 4, 2, 192, NULL),
(39, 'An Introduction to Book History', 'David Finkelstein, Alistair McCleery', 'Routledge', 'Social Science', '9781134380060', 167, 10, 2, 967, NULL),
(40, 'The Little Book of History', 'DK', 'Dorling Kindersley Ltd', 'History', '9780241547489', 503, 11, 2, 552, NULL),
(41, 'End of History and the Last Man', 'Francis Fukuyama', 'Simon and Schuster', 'History', '9781416531784', 464, 5, 2, 662, NULL),
(42, 'The Cambridge Companion to the History of the Book', 'Leslie Howsam', 'Cambridge University Press', 'Language Arts & Disciplines', '9781107023734', 301, 10, 2, 655, NULL),
(43, 'A Little History of the World', 'E. H. Gombrich', 'Yale University Press', 'History', '9780300213973', 401, 5, 2, 287, NULL),
(44, 'The History Book (Miles Kelly).', 'MAKE BELIEVE IDEAS LTD. MAKE BELIEVE IDEAS LTD, Simon Adams, Philip Steele, Stewart Ross, Richard Platt', '', 'World history', '9781805443407', 0, 11, 2, 271, NULL),
(45, 'Encyclopedia of Local History', 'Carol Kammen, Amy H. Wilson', 'Rowman & Littlefield Publishers', 'United States', '9780759120488', 0, 4, 2, 393, NULL),
(46, 'History at the Limit of World-History', 'Ranajit Guha', 'Columbia University Press', 'History', '9780231505093', 156, 2, 2, 152, NULL),
(47, 'A World at Arms', 'Gerhard L. Weinberg', 'Cambridge University Press', 'History', '9780521618267', 1216, 9, 2, 385, NULL),
(48, 'Quirky History', 'Mini Menon', 'Harper Collins', 'Juvenile Nonfiction', '9789353578800', 184, 4, 2, 468, NULL),
(49, 'A History of Modern India, 1480-1950', 'Claude Markovits', 'Anthem Press', 'History', '9781843311522', 617, 9, 2, 182, NULL),
(50, 'Rethinking History', 'Keith Jenkins', 'Routledge', 'History', '9781134408283', 116, 4, 2, 309, NULL),
(51, 'A History of History', 'Alun Munslow', 'Routledge', 'History', '9780415677141', 236, 10, 2, 899, NULL),
(52, 'A History of India', 'Hermann Kulke, Dietmar Rothermund', 'Psychology Press', 'India', '9780415154826', 406, 3, 2, 765, NULL),
(53, 'An Introduction to Book History', 'David Finkelstein, Alistair McCleery', 'Routledge', 'Design', '9780415688055', 178, 9, 2, 127, NULL),
(54, 'What Is History, Now?', 'Suzannah Lipscomb, Helen Carr', 'Hachette UK', 'History', '9781474622486', 285, 2, 2, 944, NULL),
(55, 'The Oxford Illustrated History of the Book', 'James Raven', 'Oxford University Press', 'Crafts & Hobbies', '9780191007507', 468, 4, 2, 638, NULL),
(56, 'A Textbook of Historiography, 500 B.C. to A.D. 2000', 'E. Sreedharan', 'Orient Blackswan', 'History', '9788125026570', 600, 6, 2, 256, NULL),
(57, 'A Concise History of Greece', 'Richard Clogg', 'Cambridge University Press', 'History', '9780521004794', 316, 6, 2, 168, NULL),
(58, 'Time and Power', 'Christopher Clark', 'Princeton University Press', 'History', '9780691217321', 310, 7, 2, 872, NULL),
(59, 'International Law and the Politics of History', 'Anne Orford', 'Cambridge University Press', 'History', '9781108480949', 395, 9, 2, 152, NULL),
(60, 'National Geographic History Book', 'Marcus Cowper', 'National Geographic Books', 'History', '9781426206795', 188, 6, 2, 751, NULL),
(61, 'Search History', 'Eugene Lim', 'Coffee House Press', 'Fiction', '9781566896269', 162, 8, 2, 494, NULL),
(62, 'A History of the Modern World', 'Ranjan Chakrabarti', 'Primus Books', 'History, Modern', '9789380607504', 0, 6, 2, 117, NULL),
(63, 'Sapiens', 'Yuval Noah Harari', 'Random House', 'History', '9781448190690', 353, 5, 2, 804, NULL),
(64, 'The Past Before Us', 'Romila Thapar', 'Harvard University Press', 'History', '9780674726529', 915, 3, 2, 870, NULL),
(65, 'History Education and Conflict Transformation', 'Charis Psaltis, Mario Carretero, Sabina Čehajić-Clancy', 'Springer', 'Education', '9783319546810', 389, 6, 2, 937, NULL),
(66, 'The Calling of History', 'Dipesh Chakrabarty', 'University of Chicago Press', 'Biography & Autobiography', '9780226100456', 315, 4, 2, 171, NULL),
(67, 'What is the History of the Book?', 'James Raven', 'John Wiley & Sons', 'History', '9781509523214', 196, 11, 2, 648, NULL),
(68, 'Wise & Otherwise', 'Sudha Murthy', 'Penguin UK', 'Literary Collections', '9788184759006', 232, 3, 2, 825, NULL),
(69, 'The Tastiest Of All', 'Sudha Murthy', 'Penguin UK', 'Juvenile Fiction', '9789351183594', 12, 7, 2, 282, NULL),
(70, 'Grandma\'s Bag of Stories', 'Sudha Murthy', 'Puffin', 'Children\'s stories', '9780143333623', 192, 9, 2, 637, NULL),
(71, 'The Seed of Truth', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183563', 13, 3, 2, 438, NULL),
(72, 'The Day I Stopped Drinking Milk', 'Sudha Murthy', 'Penguin UK', 'Literary Collections', '9789351180555', 14, 4, 2, 180, NULL),
(73, 'The Call', 'Jane Doe', 'Penguin UK', 'Literary Collections', '9789351180715', 10, 11, 2, 388, NULL),
(74, 'A Fair Deal', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183556', 13, 6, 2, 401, NULL),
(75, 'Three Women, Three Ponds', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180593', 10, 7, 2, 738, NULL),
(76, 'Helping the Dead', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180586', 0, 5, 2, 588, NULL),
(77, 'Genes', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180579', 0, 9, 2, 626, NULL),
(78, 'A Woman\'s Ritual', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180685', 10, 3, 2, 363, NULL),
(79, 'The Gift of Sacrifice', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180630', 0, 7, 2, 742, NULL),
(80, 'No Man’s Garden', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180609', 0, 8, 2, 718, NULL),
(81, 'The Best Friend', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183693', 13, 2, 2, 363, NULL),
(82, 'Hindu Mother, Muslim Son', 'Jane Doe', 'Penguin UK', 'Literary Collections', '9789351180531', 10, 10, 2, 465, NULL),
(83, 'The Selfish Groom', 'Jane Doe', 'Penguin UK', 'Fiction', '9789351183860', 13, 11, 2, 234, NULL),
(84, 'Uncle Sam', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180708', 0, 7, 2, 577, NULL),
(85, 'The Wise King', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183662', 13, 2, 2, 281, NULL),
(86, 'Lazy Portado', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180692', 0, 9, 2, 475, NULL),
(87, 'Miserable Success', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180678', 0, 8, 2, 533, NULL),
(88, 'Good Luck, Gopal', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183709', 14, 9, 2, 239, NULL),
(89, 'Do You Remember?', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180739', 0, 3, 2, 399, NULL),
(90, 'Teen Hazar Tanke', 'Sudha Murthy', '', 'Fiction', '9789352667437', 178, 3, 2, 276, NULL),
(91, 'The Clever Brothers', 'Jane Doe', 'Penguin UK', 'Fiction', '9789351183761', 12, 10, 2, 984, NULL),
(92, 'Sharing with a Ghost', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180654', 0, 2, 2, 390, NULL),
(94, 'Foot in the Mouth', 'Jane Doe', 'Penguin UK', 'Literary Collections', '9789351180661', 0, 10, 2, 700, NULL),
(95, 'MANADA MATU', 'Jane Doe', 'Sapna Book House (P) Ltd.', 'Authors, Kannada', '9788128004353', 186, 10, 2, 429, NULL),
(96, 'Apna Deepak Swayam Banen', 'Sudha Murty', 'Prabhat Prakashan', 'Self-Help', '9788173155000', 90, 2, 2, 845, NULL),
(97, 'Dollar Bahoo', 'Sudha Murty', 'Prabhat Prakashan', 'Fiction', '9788173153501', 99, 8, 2, 138, NULL),
(98, 'Common Yet Uncommon (Hindi)/Sadharan Phir Bhi Asadharan/साधारण फिर भी असाधारण', 'Sudha Murthy/सुधा मूर्ति', 'Penguin Random House India Private Limited', 'Fiction', '9789357088961', 181, 9, 2, 756, NULL),
(99, 'KANNADA : SAMANYARALLI ASAMANYARU', 'Smt. Sudha Murthy ji', 'Sapna Book House (P) Ltd.', 'Short stories, Kannada', '9788128005039', 183, 8, 2, 562, NULL),
(100, 'Magic in the Air', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183853', 14, 5, 2, 446, NULL),
(101, 'Emperor of Alakavati', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183730', 17, 8, 2, 442, NULL),
(102, 'The Last Laddoo', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183587', 13, 8, 2, 773, NULL),
(103, 'The White Crow', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183631', 13, 5, 2, 638, NULL),
(104, 'The Magic Drum', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183907', 14, 7, 2, 772, NULL),
(105, 'Sita', 'Amish Tripathi', 'Harper Collins', 'Fiction', '9789356290945', 333, 9, 2, 945, NULL),
(106, 'The Oath of the Vayuputras', 'Amish Tripathi', 'Hachette UK', 'Fiction', '9781780874104', 400, 2, 2, 506, NULL),
(107, 'The Bachelor Dad', 'Tusshar Kapoor', 'Penguin Random House India Private Limited', 'Biography & Autobiography', '9789354924255', 192, 5, 2, 500, NULL),
(108, 'Xx C. Top', 'Vytenis Rozukas', 'AuthorHouse', 'Fiction', '9781496976987', 295, 3, 2, 808, NULL),
(109, 'The Nine-Chambered Heart', 'Janice Pariat', 'Harper Collins', 'Fiction', '9789352773800', 216, 11, 2, 994, NULL),
(110, 'Ramayana Pack (4 Volumes)', 'Shubha Vilas', 'Jaico Publishing House', 'Self-Help', '9789386867650', 1303, 6, 2, 431, NULL),
(111, 'The Secret Of The Nagas (Shiva Trilogy Book 2)', 'Amish Tripathi', 'Harper Collins', 'Fiction', '9789356290679', 337, 3, 2, 874, NULL),
(112, 'Ancient Promises', 'Jaishree Misra', 'Penguin Books India', 'East Indians', '9780140293593', 324, 6, 2, 278, NULL),
(113, 'Advances in Computer and Computational Sciences', 'Sanjiv K. Bhatia, Krishn K. Mishra, Shailesh Tiwari, Vivek Kumar Singh', 'Springer', 'Technology & Engineering', '9789811037733', 713, 4, 2, 467, NULL),
(114, 'The Sialkot Saga', 'Ashwin Sanghi', 'Harper Collins', 'Fiction', '9789356292468', 546, 2, 2, 504, NULL),
(115, 'Son of the Thundercloud', 'Easterine Kire', '', 'Fiction', '9789386338143', 152, 4, 2, 117, NULL),
(116, 'Fluid', 'Ashish Jais', 'jj', 'Education', '9788183285278', 256, 7, 2, 776, NULL),
(117, 'The Liberation of Sita', 'Volga', 'Harper Collins', 'Fiction', '9789352775026', 128, 6, 2, 726, NULL),
(118, 'The Eternal World', 'Christopher Farnsworth', 'HarperCollins', 'Fiction', '9780062282934', 365, 9, 2, 301, NULL),
(119, 'Keepers of the Kalachakra', 'Ashwin Sanghi', 'Harper Collins', 'Fiction', '9789356292482', 374, 3, 2, 130, NULL),
(120, 'Digital Hinduism', 'Xenia Zeiler', 'Routledge', 'Religion', '9781351607322', 304, 8, 2, 548, NULL),
(121, 'The Illuminated', 'Anindita Ghose', 'Harper Collins', 'Fiction', '9789354226182', 234, 4, 2, 450, NULL),
(122, 'Boats on Land', 'Janice Pariat', 'Random House India', 'Fiction', '9788184003390', 200, 6, 2, 505, NULL),
(123, 'Cuckold', 'Kiran Nagarkar', 'Harper Collins', 'Fiction', '9789351770107', 633, 10, 2, 173, NULL),
(124, 'Stories We Never Tell', 'Savi Sharma', 'Harper Collins', 'Fiction', '9789356293304', 204, 7, 2, 153, NULL),
(125, 'The Fisher Queen\'s Dynasty', 'Kavita Kané', 'Rupa Publ iCat Ions India', 'Fiction', '9789355208767', 0, 10, 2, 147, NULL),
(126, 'Chander and Sudha', 'Dharamvir Bharati', 'Penguin UK', 'Fiction', '9788184750294', 360, 6, 2, 176, NULL),
(127, 'Living with Merlin', 'Anita Bakshi', 'Partridge Publishing', 'Self-Help', '9781482840193', 233, 8, 2, 340, NULL),
(128, 'Ramayana: The Game of Life – Book 2: Conquer Change', 'Shubha Vilas', 'Jaico Publishing House', 'Religion and spirituality', '9789386348906', 404, 18, 11, 170, NULL),
(129, 'Food Fights', 'Charles C. Ludington, Matthew Morse Booker', '', 'Cooking', '9781469652894', 304, 8, 2, 631, NULL),
(130, 'The Shape of Design', 'Frank Chimero', '', 'Design', '9780985472207', 131, 6, 2, 743, NULL),
(131, 'Everyone Has a Story', 'Savi Sharma', '', 'Friendship', '9789386036759', 0, 8, 2, 823, NULL),
(132, 'Go Kiss the World', 'Subroto Bagchi', 'Penguin Books India', 'Executives', '9780670082308', 260, 8, 2, 885, NULL),
(133, 'Scion of Ikshvaku', 'Amish, Amish Tripathi', 'Westland Publication Limited', 'Hindu mythology', '9789385152146', 0, 6, 2, 956, NULL),
(134, 'The Sand Fish', 'Maha Gargash', 'Harper Collins', 'Fiction', '9780061959868', 0, 3, 2, 223, NULL),
(135, '2 States: The Story of My Marriage (Movie Tie-In Edition)', 'Chetan Bhagat', 'Rupa Publications', 'Fiction', '9788129132543', 280, 10, 2, 849, NULL),
(136, 'The Woman on the Orient Express', 'Lindsay Jayne Ashford', 'Charnwood', 'Female friendship', '9781444836714', 416, 7, 2, 774, NULL),
(137, 'Let\'s Talk Money', 'Monika Halan', 'Harper Collins', 'Business & Economics', '9789352779406', 184, 8, 2, 324, NULL),
(138, 'Blind Faith', 'Sagarika Ghose', 'Harper Collins', 'Fiction', '9789351367994', 188, 3, 2, 998, NULL),
(139, 'Dysmorphic Kingdom', 'Colleen Chen', '', 'Fantasy fiction', '9781940233239', 320, 6, 2, 318, NULL),
(140, 'Advice and Dissent', 'Y.V. Reddy', 'Harper Collins', 'Biography & Autobiography', '9789352643059', 496, 7, 2, 295, NULL),
(141, 'Angels and Demons', 'Dan Brown', 'Simon and Schuster', 'Fiction', '9780743493468', 496, 22, 2, 424, NULL),
(142, 'Angels and Demons', 'Dan Brown', 'Corgi Books', 'Fiction', '9780552160896', 0, 3, 2, 233, NULL),
(143, 'Angels & Demons', 'Dan Brown', 'Simon and Schuster', 'Anti-Catholicism', '9781416528654', 8, 9, 2, 696, NULL),
(144, 'Angels & Demons Special Illustrated Edition', 'Dan Brown', 'Simon and Schuster', 'Fiction', '9780743277716', 532, 10, 2, 877, NULL),
(145, 'Angels and Demons', 'Dan Brown', 'Random House', 'Anti-Catholicism', '9780552173469', 642, 5, 2, 397, NULL),
(146, 'Angels and Demons', 'Serge-Thomas Bonino', 'CUA Press', 'Religion', '9780813227993', 345, 10, 2, 155, NULL),
(147, 'Angels and Demons', 'Peter Kreeft', 'Ignatius Press', 'Religion', '9781681490380', 164, 4, 2, 384, NULL),
(148, 'Angels and Demons', 'Benny Hinn', 'Benny Hinn Ministries', 'Religion', '9781590244593', 208, 11, 2, 455, NULL),
(149, 'Dan Brown’s Robert Langdon Series', 'Dan Brown', 'Random House', 'Fiction', '9781473543201', 2082, 6, 2, 124, NULL),
(150, 'The Mammoth Book of Angels & Demons', 'Paula Guran', 'Hachette UK', 'Fiction', '9781780338002', 405, 8, 2, 956, NULL),
(151, 'The Eight', 'Katherine Neville', 'Open Road Media', 'Fiction', '9781504013673', 523, 5, 2, 704, NULL),
(152, 'Angels, Demons and the New World', 'Fernando Cervantes, Andrew Redden', 'Cambridge University Press', 'Body, Mind & Spirit', '9780521764582', 331, 9, 2, 555, NULL),
(153, 'Angels and Demons', 'Ron Phillips', 'Charisma Media', 'Body, Mind & Spirit', '9781629980348', 289, 11, 2, 563, NULL),
(154, 'Angels And Demons', 'Dan Brown', 'Random House', 'Fiction', '9781409083948', 663, 4, 2, 151, NULL),
(155, 'Secrets of Angels and Demons', 'Daniel Burstein', '', 'Popes in literature', '9780752876931', 595, 5, 2, 765, NULL),
(156, 'Angels, Demons & Gods of the New Millenium', 'Lon Milo Duquette', 'Weiser Books', 'Body, Mind & Spirit', '9781578630103', 196, 4, 2, 573, NULL),
(157, 'Angels and Demons in Art', 'Rosa Giorgi', 'Getty Publications', 'Angels in art', '9780892368303', 384, 3, 2, 467, NULL),
(158, 'Demon Angel', 'Meljean Brook', 'Penguin', 'Fiction', '9781101568026', 411, 4, 2, 520, NULL),
(159, 'Angels & Demons Rome', 'Angela K. Nickerson', 'Roaring Forties Press', 'Travel', '9780984316557', 71, 2, 2, 197, NULL),
(160, 'What Does the Bible Say About Angels and Demons?', 'John Gillman, Clifford M. Yeary', 'New City Press', 'Religion', '9781565483804', 93, 9, 2, 229, NULL),
(161, 'The Sherlock Holmes Mysteries', 'Sir Arthur Conan Doyle', 'Penguin', 'Fiction', '9780698168237', 546, 4, 2, 451, NULL),
(162, 'Demons & Angels', 'J.K. Norry', 'Sudden Insight Publishing', 'Fiction', '9780990728030', 278, 5, 2, 570, NULL),
(163, 'A Brief History of Angels and Demons', 'Sarah Bartlett', 'Hachette UK', 'Body, Mind & Spirit', '9781849018289', 164, 5, 2, 497, NULL),
(164, 'Demons, Angels, and Writing in Ancient Judaism', 'Annette Yoshiko Reed', 'Cambridge University Press', 'Religion', '9780521119436', 365, 11, 2, 673, NULL),
(165, 'An Angel, a Demon, a Candle', 'Cordelia Faass', 'Xlibris Corporation', 'Fiction', '9781479746750', 99, 4, 2, 876, NULL),
(166, 'Sense and Nonsense about Angels and Demons', 'Kenneth Boa, Robert M. Bowman Jr.', 'Zondervan', 'Religion', '9780310254294', 161, 4, 2, 459, NULL),
(167, 'Origin', 'Dan Brown', 'Mizan Publishing', 'Fiction', '9786022914426', 575, 11, 2, 468, NULL),
(168, 'Angels, Satan and Demons', 'Robert Paul Lightner', 'Thomas Nelson', 'Angels', '9780849913716', 0, 10, 2, 862, NULL),
(169, 'The Truth About Angels and Demons', 'Tony Evans', 'Moody Publishers', 'Religion', '9781575677286', 64, 11, 2, 103, NULL),
(170, 'Angelfall', 'Susan Ee', 'Hachette UK', 'Fiction', '9781444778526', 320, 10, 2, 534, NULL),
(171, 'Deception Point', 'Dan Brown', 'Pocket Books', 'Fiction', '9781982122355', 752, 9, 2, 461, NULL),
(172, 'The Magick of Angels and Demons', 'Henry Archer', 'Independently Published', 'Body, Mind & Spirit', '9781796703405', 230, 6, 2, 604, NULL),
(174, 'The Language of Demons and Angels', 'Christopher I. Lehrich', 'BRILL', 'Body, Mind & Spirit', '9789004135741', 276, 8, 2, 633, NULL),
(175, 'Angels and Demons (Republish)', 'Dan Brown', 'Mizan Publishing', 'Fiction', '9786022914532', 0, 9, 2, 355, NULL),
(190, 's', 's', 's', 's', 's', 44, 4, 2, 678, NULL),
(192, 'Kite Runner', 'Khalid Hossaini', 'gfhsjs', 'Novel', '1234567890', 766, 8, 2, 422, NULL),
(193, 'The 5 am club', 'Robin Sharma', 'Penguin', 'Self Help', '1234567890123', 566, 7, 2, 878, NULL),
(194, 'verity', 'collin hoover', 'penguin', 'gfff4', '9876543219876', 455, 5, 2, 322, NULL),
(196, 'The man called Ove', 'dgasj', 'penguin', 'dsadsdf', '12345675478', 988, 9, 2, 678, NULL),
(197, 'r', 'r', 'r', 'r', 'r', 5, 5, 2, 521, NULL),
(200, 'f', 'f', 'f', 'f', 'f', 655, 6, 2, 474, NULL),
(201, 'It Ends With Us', 'Collin Hoover', 'Penguin', 'gggdsj', '9731733436', 561, 2, 2, 708, NULL),
(202, 'Dark', 'Coll', 'Penguin', 'gsj', '9731743436', 561, 2, 2, 217, NULL),
(203, 'Wings Of Fire', 'Abdul Kalam', 'Penguin', 'Motivation', '9731743437', 561, 2, 2, 663, NULL),
(204, 'Atomic Habits', 'James Clear', 'Penguin', 'Motivation', '9731843437', 561, 2, 2, 762, NULL),
(205, 'Atomic Habits 1', 'James Clear 1', 'Penguin 1', 'Motivation', '9732843437', 561, 4, 2, 822, NULL),
(206, 'Atomic Habits 2', 'James Clear 2', 'Penguin 2', 'Motivation', '8732843437', 561, 12, 2, 821, NULL),
(207, 'An Introduction to Book History 1', 'David Finkelstein, Alistair McCleery 1', 'Routledge 1', 'Design', '9780425688055', 178, 27, 2, 639, NULL),
(208, 'An Introduction to Book History 2', 'David Finkelstein, Alistair McCleery 2', 'Routledge 2', 'Design', '2780425688055', 178, 9, 2, 634, NULL),
(209, 'An Introduction to Book History 3', 'David Finkelstein, Alistair McCleery 3', 'Routledge 3', 'Design', '3780425688055', 178, 9, 2, 252, NULL),
(210, 'An Introduction to Book History 4', 'David Finkelstein, Alistair McCleery 4', 'Routledge 4', 'Design', '4780425688055', 178, 9, 2, 158, NULL),
(212, 'An Introduction to Book History 5', 'David Finkelstein, Alistair McCleery 5', 'Routledge 4', 'Design', '5780425688055', 9, 18, 2, 836, NULL),
(213, 'An Introduction to Book History 6', 'David Finkelstein, Alistair McCleery 6', 'Routledge 4', 'History', '6780425688055', 9, 27, 2, 904, NULL),
(214, 'An Introduction to Book History 7', 'David Finkelstein, Alistair McCleery 7', 'Routledge 4', 'History', '7780425688055', 9, 9, 2, 112, NULL),
(215, 'An Introduction to Book History 8', 'David Finkelstein, Alistair McCleery 8', 'Routledge 4', 'History', '8780425688055', 9, 9, 2, 449, NULL),
(216, 'Elanor Oliphant is Completely fine ', 'Jin', 'penguin', 'Fiction', '1783492345', 400, 3, 2, 909, NULL),
(217, 'It starts with us ', 'Colin Hoover', 'Penguin', 'Fiction', '1783492345', 900, 8, 2, 396, NULL),
(219, 'flying bird', 'Elephant', 'penguin', 'fiction', '5557774788', 500, 9, 9, 957, NULL),
(223, 'The Thousand Splendid Suns', 'khalid Hossaienie', 'penguin', 'fiction', '3248723491', 700, 4, 4, 795, NULL),
(232, 'India', 'Ary', 'Penguin', 'History', '4040404040', 40, 4, 4, 400, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` bigint UNSIGNED NOT NULL,
  `firstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phoneNumber` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `membershipStatus` varchar(10) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `firstName`, `lastName`, `email`, `phoneNumber`, `address`, `membershipStatus`, `password`, `role`) VALUES
(247, 'Shafana', 'Shafi', 'shafana.shafi@codecraft.co.in', '8971091841', 'Udupi', 'active', '$2b$10$wabO6U3HRtQqk0r9GcNgne8cGoGLYMNnd4WuObkeLMrEXH4bV7mCW', 'user'),
(248, 'Shifa ', 'Shafana', 'shifashafana14@gmail.com', '9741115869', 'Udupi', 'active', '$2b$10$Z2k.2uVuMmkacfBiNDKbKuS2YslIDRtt3QNaUQTZIwG9MIqh81XnC', 'admin'),
(249, 'Shahistha', 'Aliya', 'shahialiya06@gmail.com', NULL, NULL, 'active', '$2b$10$cCLy5fuPGGesuW6RPWaAM.i74uyfSkMFHTW0Vjn0uYOZOs4wmYyvu', 'user'),
(250, 'Fathima', 'Huda', 'fathimahuda@gmail.com', NULL, NULL, 'active', '$2b$10$e5nRldr7d1NMvxISDTrcfeVvOl7Il38iJz96Q3q/dCOMa0EdIkePS', 'user'),
(255, 'Zoya', 'Faruki', 'zoyafaruki123@gmail.com', NULL, NULL, 'active', '$2b$10$RzxCyVWTxid4jlBzcN5NCO/TqXN4531Zl9XeJvh4W5Mu3Ad3Yxq1m', 'user'),
(260, 'Fathima', 'Sidra', 'fathimasidra@gmail.com', '9741115869', 'Bangalore', 'active', '$2b$10$naqYQ4/hRoiD4.BRKUAG0OAYi62KH0uXim1PcHa/TwcfHinPiCjm.', 'user'),
(261, 'Shahistha', 'Aliya', 'shahisthaaliya@gmail.com', '6366310839', 'Bangalore', 'active', '$2a$10$UKuD8UX4ZOZ.uyuR9p8UnuI1Y5w4afHb3T6lpEKh8oTw1YE1ygZ2i', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_token`
--

CREATE TABLE `refresh_token` (
  `id` bigint UNSIGNED NOT NULL,
  `memberId` bigint UNSIGNED DEFAULT NULL,
  `refreshToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` varchar(255) NOT NULL,
  `expiresAt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` bigint UNSIGNED NOT NULL,
  `memberId` bigint UNSIGNED DEFAULT NULL,
  `bookId` bigint UNSIGNED DEFAULT NULL,
  `requestDate` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `issuedDate` date DEFAULT NULL,
  `returnDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `memberId`, `bookId`, `requestDate`, `status`, `issuedDate`, `returnDate`) VALUES
(42, 255, 16, '2024-09-17', 'returned', '2024-09-17', '2024-09-17'),
(43, 255, 16, '2024-09-17', 'declined', NULL, NULL),
(44, 255, 22, '2024-09-17', 'success', '2024-09-17', NULL),
(45, 247, 9, '2024-09-17', 'requested', NULL, NULL),
(46, 247, 12, '2024-09-17', 'requested', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `trainees`
--

CREATE TABLE `trainees` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dob` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `trainees`
--

INSERT INTO `trainees` (`id`, `name`, `email`, `dob`, `address`) VALUES
(2, 'shafa', 'shifashafana@gmail.com', '2002-12-19', 'Kundapura');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint UNSIGNED NOT NULL,
  `memberid` bigint UNSIGNED DEFAULT NULL,
  `bookid` bigint UNSIGNED DEFAULT NULL,
  `borrowDate` date NOT NULL,
  `returnDate` date DEFAULT NULL,
  `dueDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `memberid`, `bookid`, `borrowDate`, `returnDate`, `dueDate`) VALUES
(37, 247, 4, '2024-09-11', NULL, '2024-09-25');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`) VALUES
(1, 'John Doe'),
(4, 'Shifa Shafana');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `refresh_token`
--
ALTER TABLE `refresh_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `member_id` (`memberId`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `bookId` (`bookId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `trainees`
--
ALTER TABLE `trainees`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `idx_email_unique` (`email`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `transactions_ibfk_1` (`bookid`),
  ADD KEY `memberid` (`memberid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263;

--
-- AUTO_INCREMENT for table `refresh_token`
--
ALTER TABLE `refresh_token`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `trainees`
--
ALTER TABLE `trainees`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `refresh_token`
--
ALTER TABLE `refresh_token`
  ADD CONSTRAINT `refresh_token_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `bookId` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `memberId` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`bookid`) REFERENCES `books` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`memberid`) REFERENCES `members` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
