#!/usr/bin/env python3
"""Append NAIA conferences to the seed file."""

SQL = """
-- =============================================================================
-- NAIA
-- =============================================================================

-- =============================================================================
-- Appalachian Athletic Conference - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bluefield Rams', 'Bluefield (VA)', 'BLVA', 'bluefield-va', 'Rams', 'Appalachian Athletic', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Mitchell Stadium', 'Bluefield', 'VA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Kentucky Christian Knights', 'Kentucky Christian', 'KYCU', 'kentucky-christian', 'Knights', 'Appalachian Athletic', NULL, 'NAIA', '#CC0000', '#000000', NULL, 'KCU Stadium', 'Grayson', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Pikeville Bears', 'Pikeville', 'PIKE', 'pikeville', 'Bears', 'Appalachian Athletic', NULL, 'NAIA', '#000000', '#CFB53B', NULL, 'Hambley Athletic Complex', 'Pikeville', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Point Skyhawks', 'Point', 'PTGA', 'point', 'Skyhawks', 'Appalachian Athletic', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Point Stadium', 'West Point', 'GA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Reinhardt Eagles', 'Reinhardt', 'RENH', 'reinhardt', 'Eagles', 'Appalachian Athletic', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Reinhardt Stadium', 'Waleska', 'GA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Rio Grande RedStorm', 'Rio Grande', 'RIOG', 'rio-grande', 'RedStorm', 'Appalachian Athletic', NULL, 'NAIA', '#CC0000', '#000000', NULL, 'Bob Evans Stadium', 'Rio Grande', 'OH', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Union Bulldogs', 'Union (KY)', 'UNKY', 'union-ky', 'Bulldogs', 'Appalachian Athletic', NULL, 'NAIA', '#CC0000', '#808080', NULL, 'Union Stadium', 'Barbourville', 'KY', false);

-- =============================================================================
-- Frontier Conference - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Arizona Christian Firestorm', 'Arizona Christian', 'AZCH', 'arizona-christian', 'Firestorm', 'Frontier', NULL, 'NAIA', '#8B0000', '#CFB53B', NULL, 'ACU Field', 'Glendale', 'AZ', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Carroll Fighting Saints', 'Carroll (MT)', 'CRMT', 'carroll-mt', 'Fighting Saints', 'Frontier', NULL, 'NAIA', '#4B0082', '#CFB53B', NULL, 'Nelson Stadium', 'Helena', 'MT', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('College of Idaho Yotes', 'College of Idaho', 'COID', 'college-of-idaho', 'Yotes', 'Frontier', NULL, 'NAIA', '#4B0082', '#CFB53B', NULL, 'Simplot Stadium', 'Caldwell', 'ID', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Dakota State Trojans', 'Dakota State', 'DKST', 'dakota-state', 'Trojans', 'Frontier', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Trojan Field', 'Madison', 'SD', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Dickinson State Blue Hawks', 'Dickinson State', 'DKSU', 'dickinson-state', 'Blue Hawks', 'Frontier', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Biesiot Activities Center Field', 'Dickinson', 'ND', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Eastern Oregon Mountaineers', 'Eastern Oregon', 'EORU', 'eastern-oregon', 'Mountaineers', 'Frontier', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Community Stadium', 'La Grande', 'OR', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('MSU-Northern Lights', 'MSU-Northern', 'MSUN', 'msu-northern', 'Lights', 'Frontier', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Tilleman Field', 'Havre', 'MT', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Montana Tech Orediggers', 'Montana Tech', 'MTCH', 'montana-tech', 'Orediggers', 'Frontier', NULL, 'NAIA', '#006633', '#C0C0C0', NULL, 'Alumni Coliseum Field', 'Butte', 'MT', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Montana Western Bulldogs', 'Montana Western', 'MTWU', 'montana-western', 'Bulldogs', 'Frontier', NULL, 'NAIA', '#CC0000', '#C0C0C0', NULL, 'Vigilante Field', 'Dillon', 'MT', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Rocky Mountain College Battlin'' Bears', 'Rocky Mountain', 'ROMC', 'rocky-mountain', 'Battlin'' Bears', 'Frontier', NULL, 'NAIA', '#CC0000', '#CFB53B', NULL, 'Herb Klindt Field', 'Billings', 'MT', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Southern Oregon Raiders', 'Southern Oregon', 'SORU', 'southern-oregon', 'Raiders', 'Frontier', NULL, 'NAIA', '#CC0000', '#000000', NULL, 'Raider Stadium', 'Ashland', 'OR', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Valley City State Vikings', 'Valley City State', 'VCSU', 'valley-city-state', 'Vikings', 'Frontier', NULL, 'NAIA', '#CC0000', '#FFFFFF', NULL, 'Lokken Stadium', 'Valley City', 'ND', false);

-- =============================================================================
-- Great Plains Athletic Conference (GPAC) - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Briar Cliff Chargers', 'Briar Cliff', 'BRCL', 'briar-cliff', 'Chargers', 'GPAC', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Memorial Field', 'Sioux City', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Concordia Bulldogs', 'Concordia (NE)', 'CONE', 'concordia-ne', 'Bulldogs', 'GPAC', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Bulldog Stadium', 'Seward', 'NE', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Dakota Wesleyan Tigers', 'Dakota Wesleyan', 'DWU', 'dakota-wesleyan', 'Tigers', 'GPAC', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Joe Quintal Field', 'Mitchell', 'SD', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Doane Tigers', 'Doane', 'DOAN', 'doane', 'Tigers', 'GPAC', NULL, 'NAIA', '#FF6600', '#000000', NULL, 'Al Papik Field', 'Crete', 'NE', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Dordt Defenders', 'Dordt', 'DRDT', 'dordt', 'Defenders', 'GPAC', NULL, 'NAIA', '#006633', '#FFFFFF', NULL, 'Dordt Stadium', 'Sioux Center', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hastings Broncos', 'Hastings', 'HAST', 'hastings', 'Broncos', 'GPAC', NULL, 'NAIA', '#8B0000', '#FFFFFF', NULL, 'Lloyd Wilson Field', 'Hastings', 'NE', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Midland Warriors', 'Midland', 'MDLD', 'midland', 'Warriors', 'GPAC', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'Heedum Field', 'Fremont', 'NE', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Morningside Mustangs', 'Morningside', 'MRNS', 'morningside', 'Mustangs', 'GPAC', NULL, 'NAIA', '#8B0000', '#FFFFFF', NULL, 'Elwood Olsen Stadium', 'Sioux City', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Mount Marty Lancers', 'Mount Marty', 'MTMY', 'mount-marty', 'Lancers', 'GPAC', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Lancer Field', 'Yankton', 'SD', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Northwestern Red Raiders', 'Northwestern (IA)', 'NWIA', 'northwestern-ia', 'Red Raiders', 'GPAC', NULL, 'NAIA', '#CC0000', '#FFFFFF', NULL, 'De Valois Stadium', 'Orange City', 'IA', false);

-- =============================================================================
-- Heart of America Athletic Conference - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Baker Wildcats', 'Baker', 'BKRU', 'baker', 'Wildcats', 'Heart of America', NULL, 'NAIA', '#FF6600', '#000000', NULL, 'Liston Stadium', 'Baldwin City', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Benedictine Ravens', 'Benedictine (KS)', 'BNKS', 'benedictine-ks', 'Ravens', 'Heart of America', NULL, 'NAIA', '#CC0000', '#FFFFFF', NULL, 'Larry Wilcox Stadium', 'Atchison', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Culver-Stockton Wildcats', 'Culver-Stockton', 'CSTK', 'culver-stockton', 'Wildcats', 'Heart of America', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'Ellison-Poulton Stadium', 'Canton', 'MO', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Evangel Crusaders', 'Evangel', 'EVNG', 'evangel', 'Crusaders', 'Heart of America', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'Crusader Stadium', 'Springfield', 'MO', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Graceland Yellowjackets', 'Graceland', 'GRAC', 'graceland', 'Yellowjackets', 'Heart of America', NULL, 'NAIA', '#FFD700', '#000000', NULL, 'Graceland Stadium', 'Lamoni', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Grand View Vikings', 'Grand View', 'GRVW', 'grand-view', 'Vikings', 'Heart of America', NULL, 'NAIA', '#CC0000', '#FFFFFF', NULL, 'Williams Stadium', 'Des Moines', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('MidAmerica Nazarene Pioneers', 'MidAmerica Nazarene', 'MANU', 'midamerica-nazarene', 'Pioneers', 'Heart of America', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'Pioneer Stadium', 'Olathe', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('William Penn Statesmen', 'William Penn', 'WPNN', 'william-penn', 'Statesmen', 'Heart of America', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Statesmen Stadium', 'Oskaloosa', 'IA', false);

-- =============================================================================
-- Kansas Collegiate Athletic Conference (KCAC) - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Avila Eagles', 'Avila', 'AVLA', 'avila', 'Eagles', 'KCAC', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Avila Field', 'Kansas City', 'MO', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bethany Swedes', 'Bethany (KS)', 'BTKS', 'bethany-ks', 'Swedes', 'KCAC', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Anderson Stadium', 'Lindsborg', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bethel Threshers', 'Bethel (KS)', 'BTKS2', 'bethel-ks', 'Threshers', 'KCAC', NULL, 'NAIA', '#808080', '#CC0000', NULL, 'Thresher Stadium', 'North Newton', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Friends Falcons', 'Friends', 'FRND', 'friends', 'Falcons', 'KCAC', NULL, 'NAIA', '#CC0000', '#003399', NULL, 'Adair-Austin Stadium', 'Wichita', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Kansas Wesleyan Coyotes', 'Kansas Wesleyan', 'KWU', 'kansas-wesleyan', 'Coyotes', 'KCAC', NULL, 'NAIA', '#4B0082', '#CFB53B', NULL, 'Gene Bissell Stadium', 'Salina', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('McPherson Bulldogs', 'McPherson', 'MCPH', 'mcpherson', 'Bulldogs', 'KCAC', NULL, 'NAIA', '#CC0000', '#FFFFFF', NULL, 'McPherson Stadium', 'McPherson', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Ottawa Braves', 'Ottawa (KS)', 'OTKS', 'ottawa-ks', 'Braves', 'KCAC', NULL, 'NAIA', '#000000', '#CFB53B', NULL, 'Ottawa Stadium', 'Ottawa', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Saint Mary Spires', 'Saint Mary (KS)', 'SMKS', 'saint-mary-ks', 'Spires', 'KCAC', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Spires Stadium', 'Leavenworth', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Southwestern Moundbuilders', 'Southwestern (KS)', 'SWKS', 'southwestern-ks', 'Moundbuilders', 'KCAC', NULL, 'NAIA', '#4B0082', '#CFB53B', NULL, 'Richard L. Jantz Stadium', 'Winfield', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Sterling Warriors', 'Sterling', 'STRL', 'sterling', 'Warriors', 'KCAC', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'Sterling Stadium', 'Sterling', 'KS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Tabor Bluejays', 'Tabor', 'TABR', 'tabor', 'Bluejays', 'KCAC', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Tabor Stadium', 'Hillsboro', 'KS', false);

-- =============================================================================
-- Mid-South Conference - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bethel Wildcats', 'Bethel (TN)', 'BTTN', 'bethel-tn', 'Wildcats', 'Mid-South', NULL, 'NAIA', '#4B0082', '#FF6600', NULL, 'Wildcat Stadium', 'McKenzie', 'TN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Campbellsville Tigers', 'Campbellsville', 'CMPB', 'campbellsville', 'Tigers', 'Mid-South', NULL, 'NAIA', '#8B0000', '#808080', NULL, 'Finley Stadium', 'Campbellsville', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Cumberland Phoenix', 'Cumberland (TN)', 'CUTN', 'cumberland-tn', 'Phoenix', 'Mid-South', NULL, 'NAIA', '#8B0000', '#000000', NULL, 'Dallas Floyd Phoenix Field', 'Lebanon', 'TN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Cumberlands Patriots', 'Cumberlands', 'CUKY', 'cumberlands', 'Patriots', 'Mid-South', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Patriot Stadium', 'Williamsburg', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Georgetown Tigers', 'Georgetown (KY)', 'GTKY', 'georgetown-ky', 'Tigers', 'Mid-South', NULL, 'NAIA', '#FF6600', '#000000', NULL, 'Toyota Stadium', 'Georgetown', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Lindsey Wilson Blue Raiders', 'Lindsey Wilson', 'LNWL', 'lindsey-wilson', 'Blue Raiders', 'Mid-South', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Blue Raider Stadium', 'Columbia', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Faulkner Eagles', 'Faulkner', 'FKNU', 'faulkner', 'Eagles', 'Mid-South', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Faulkner Stadium', 'Montgomery', 'AL', false);

-- =============================================================================
-- Mid-States Football Association - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Indiana Wesleyan Wildcats', 'Indiana Wesleyan', 'INWU', 'indiana-wesleyan', 'Wildcats', 'Mid-States Football', NULL, 'NAIA', '#CC0000', '#000000', NULL, 'Wildcat Stadium', 'Marion', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Marian Knights', 'Marian (IN)', 'MRIN', 'marian-in', 'Knights', 'Mid-States Football', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'St. Vincent Health Field', 'Indianapolis', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Olivet Nazarene Tigers', 'Olivet Nazarene', 'OLNZ', 'olivet-nazarene', 'Tigers', 'Mid-States Football', NULL, 'NAIA', '#4B0082', '#CFB53B', NULL, 'Ward Field', 'Bourbonnais', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Saint Francis Cougars', 'Saint Francis (IN)', 'SFIN', 'saint-francis-in', 'Cougars', 'Mid-States Football', NULL, 'NAIA', '#CC0000', '#FFFFFF', NULL, 'Bishop D''Arcy Stadium', 'Fort Wayne', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('St. Francis Fighting Saints', 'St. Francis (IL)', 'SFIL', 'st-francis-il', 'Fighting Saints', 'Mid-States Football', NULL, 'NAIA', '#8B0000', '#CFB53B', NULL, 'Joliet Memorial Stadium', 'Joliet', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Saint Xavier Cougars', 'Saint Xavier', 'STXV', 'saint-xavier', 'Cougars', 'Mid-States Football', NULL, 'NAIA', '#8B0000', '#808080', NULL, 'SXU Stadium', 'Chicago', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Taylor Trojans', 'Taylor', 'TAYL', 'taylor', 'Trojans', 'Mid-States Football', NULL, 'NAIA', '#4B0082', '#CFB53B', NULL, 'Turner Stadium', 'Upland', 'IN', false);

-- =============================================================================
-- Sooner Athletic Conference - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Langston Lions', 'Langston', 'LANG', 'langston', 'Lions', 'Sooner Athletic', NULL, 'NAIA', '#FF6600', '#003399', NULL, 'Anderson Stadium', 'Langston', 'OK', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Oklahoma Panhandle State Aggies', 'Oklahoma Panhandle State', 'OPSU', 'oklahoma-panhandle-state', 'Aggies', 'Sooner Athletic', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Anchor D Stadium', 'Goodwell', 'OK', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Texas College Steers', 'Texas College', 'TXCL', 'texas-college', 'Steers', 'Sooner Athletic', NULL, 'NAIA', '#4B0082', '#CFB53B', NULL, 'Steer Stadium', 'Tyler', 'TX', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Texas Wesleyan Rams', 'Texas Wesleyan', 'TXWU', 'texas-wesleyan', 'Rams', 'Sooner Athletic', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Farrington Field', 'Fort Worth', 'TX', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Wayland Baptist Pioneers', 'Wayland Baptist', 'WBAP', 'wayland-baptist', 'Pioneers', 'Sooner Athletic', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Greg Sherwood Memorial Bulldog Stadium', 'Plainview', 'TX', false);

-- =============================================================================
-- Sun Conference - NAIA
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Ave Maria Gyrenes', 'Ave Maria', 'AVEM', 'ave-maria', 'Gyrenes', 'Sun Conference', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Tom Golisano Field', 'Ave Maria', 'FL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Keiser Seahawks', 'Keiser', 'KESR', 'keiser', 'Seahawks', 'Sun Conference', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'Keiser Stadium', 'West Palm Beach', 'FL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('St. Thomas Bobcats', 'St. Thomas (FL)', 'STFL', 'st-thomas-fl', 'Bobcats', 'Sun Conference', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Bobcat Stadium', 'Miami Gardens', 'FL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Southeastern Fire', 'Southeastern (FL)', 'SEFL', 'southeastern-fl', 'Fire', 'Sun Conference', NULL, 'NAIA', '#CC0000', '#000000', NULL, 'Victory Field', 'Lakeland', 'FL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Warner Royals', 'Warner', 'WARN', 'warner', 'Royals', 'Sun Conference', NULL, 'NAIA', '#003399', '#FF6600', NULL, 'Warner Field', 'Lake Wales', 'FL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Webber International Warriors', 'Webber International', 'WEBR', 'webber-international', 'Warriors', 'Sun Conference', NULL, 'NAIA', '#CC0000', '#003399', NULL, 'Warrior Field', 'Babson Park', 'FL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Edward Waters Tigers', 'Edward Waters (Sun)', 'EWSU', 'edward-waters-sun', 'Tigers', 'Sun Conference', NULL, 'NAIA', '#4B0082', '#FF6600', NULL, 'Nathaniel Glover Community Field', 'Jacksonville', 'FL', false);
"""

with open('C:/Users/beltr/cfbsocial/supabase/seed/schools-lower-divisions.sql', 'a', encoding='utf-8') as f:
    f.write(SQL)
print('NAIA section done')
