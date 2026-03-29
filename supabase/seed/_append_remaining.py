#!/usr/bin/env python3
"""Append remaining D3 and NAIA conferences to the seed file."""

SQL = """
-- =============================================================================
-- MIAC (Minnesota Intercollegiate Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Augsburg Auggies', 'Augsburg', 'AUGS', 'augsburg', 'Auggies', 'MIAC', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Edor Nelson Field', 'Minneapolis', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bethel Royals', 'Bethel (MN)', 'BTMN', 'bethel-mn', 'Royals', 'MIAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Bethel Stadium', 'St. Paul', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Carleton Knights', 'Carleton', 'CRLT', 'carleton', 'Knights', 'MIAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Laird Stadium', 'Northfield', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Concordia-Moorhead Cobbers', 'Concordia-Moorhead', 'CSMH', 'concordia-moorhead', 'Cobbers', 'MIAC', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Jake Christiansen Stadium', 'Moorhead', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Gustavus Adolphus Gusties', 'Gustavus Adolphus', 'GUST', 'gustavus-adolphus', 'Gusties', 'MIAC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Hollingsworth Field', 'St. Peter', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hamline Pipers', 'Hamline', 'HAML', 'hamline', 'Pipers', 'MIAC', NULL, 'D3', '#CC0000', '#808080', NULL, 'Klas Center Field', 'St. Paul', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Macalester Scots', 'Macalester', 'MCAL', 'macalester', 'Scots', 'MIAC', NULL, 'D3', '#FF6600', '#003399', NULL, 'Macalester Stadium', 'St. Paul', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Saint John''s Johnnies', 'Saint John''s (MN)', 'SJMN', 'saint-johns-mn', 'Johnnies', 'MIAC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Clemens Stadium', 'Collegeville', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('St. Olaf Oles', 'St. Olaf', 'STOL', 'st-olaf', 'Oles', 'MIAC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Manitou Field', 'Northfield', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('St. Scholastica Saints', 'St. Scholastica', 'STSC', 'st-scholastica', 'Saints', 'MIAC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Public Schools Stadium', 'Duluth', 'MN', false);

-- =============================================================================
-- WIAC (Wisconsin Intercollegiate Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-Eau Claire Blugolds', 'UW-Eau Claire', 'UWEC', 'uw-eau-claire', 'Blugolds', 'WIAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Carson Park', 'Eau Claire', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-La Crosse Eagles', 'UW-La Crosse', 'UWLC', 'uw-la-crosse', 'Eagles', 'WIAC', NULL, 'D3', '#8B0000', '#808080', NULL, 'Roger Harring Stadium', 'La Crosse', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-Oshkosh Titans', 'UW-Oshkosh', 'UWOS', 'uw-oshkosh', 'Titans', 'WIAC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'J.J. Keller Field at Titan Stadium', 'Oshkosh', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-Platteville Pioneers', 'UW-Platteville', 'UWPL', 'uw-platteville', 'Pioneers', 'WIAC', NULL, 'D3', '#FF6600', '#003399', NULL, 'Ralph E. Davis Pioneer Stadium', 'Platteville', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-River Falls Falcons', 'UW-River Falls', 'UWRF', 'uw-river-falls', 'Falcons', 'WIAC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Ramer Field', 'River Falls', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-Stevens Point Pointers', 'UW-Stevens Point', 'UWSP', 'uw-stevens-point', 'Pointers', 'WIAC', NULL, 'D3', '#4B0082', '#CFB53B', NULL, 'Goerke Field', 'Stevens Point', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-Stout Blue Devils', 'UW-Stout', 'UWST', 'uw-stout', 'Blue Devils', 'WIAC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Nelson Field', 'Menomonie', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UW-Whitewater Warhawks', 'UW-Whitewater', 'UWWW', 'uw-whitewater', 'Warhawks', 'WIAC', NULL, 'D3', '#4B0082', '#FFFFFF', NULL, 'Perkins Stadium', 'Whitewater', 'WI', false);

-- =============================================================================
-- NJAC (New Jersey Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Christopher Newport Captains', 'Christopher Newport', 'CNU', 'christopher-newport', 'Captains', 'NJAC', NULL, 'D3', '#003399', '#C0C0C0', NULL, 'TowneBank Stadium', 'Newport News', 'VA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Kean Cougars', 'Kean', 'KEAN', 'kean', 'Cougars', 'NJAC', NULL, 'D3', '#003399', '#808080', NULL, 'Alumni Stadium', 'Union', 'NJ', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Montclair State Red Hawks', 'Montclair State', 'MNTC', 'montclair-state', 'Red Hawks', 'NJAC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Sprague Field', 'Montclair', 'NJ', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Rowan Profs', 'Rowan', 'ROWN', 'rowan', 'Profs', 'NJAC', NULL, 'D3', '#663300', '#CFB53B', NULL, 'Richard Wacker Stadium', 'Glassboro', 'NJ', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Salisbury Sea Gulls', 'Salisbury', 'SLBY', 'salisbury', 'Sea Gulls', 'NJAC', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Sea Gull Stadium', 'Salisbury', 'MD', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('TCNJ Lions', 'TCNJ', 'TCNJ', 'tcnj', 'Lions', 'NJAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Lions Stadium', 'Ewing', 'NJ', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('William Paterson Pioneers', 'William Paterson', 'WPNJ', 'william-paterson', 'Pioneers', 'NJAC', NULL, 'D3', '#FF6600', '#000000', NULL, 'Wightman Field', 'Wayne', 'NJ', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Wesley Wolverines', 'Wesley', 'WSLY', 'wesley', 'Wolverines', 'NJAC', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Holloway Field', 'Dover', 'DE', false);

-- =============================================================================
-- ODAC (Old Dominion Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bridgewater Eagles', 'Bridgewater (VA)', 'BRVA', 'bridgewater-va', 'Eagles', 'ODAC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Jopson Field', 'Bridgewater', 'VA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Guilford Quakers', 'Guilford', 'GUIL', 'guilford', 'Quakers', 'ODAC', NULL, 'D3', '#8B0000', '#808080', NULL, 'Armfield Athletic Center', 'Greensboro', 'NC', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hampden-Sydney Tigers', 'Hampden-Sydney', 'HSYD', 'hampden-sydney', 'Tigers', 'ODAC', NULL, 'D3', '#8B0000', '#808080', NULL, 'Fulton Field', 'Hampden-Sydney', 'VA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Randolph-Macon Yellow Jackets', 'Randolph-Macon', 'RNMC', 'randolph-macon', 'Yellow Jackets', 'ODAC', NULL, 'D3', '#FFD700', '#000000', NULL, 'Day Field', 'Ashland', 'VA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Shenandoah Hornets', 'Shenandoah', 'SHEN', 'shenandoah', 'Hornets', 'ODAC', NULL, 'D3', '#CC0000', '#003399', NULL, 'Shentel Stadium', 'Winchester', 'VA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Washington and Lee Generals', 'Washington and Lee', 'WNLE', 'washington-and-lee', 'Generals', 'ODAC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Wilson Field', 'Lexington', 'VA', false);

-- =============================================================================
-- SCIAC (Southern California Intercollegiate Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Claremont-Mudd-Scripps Stags', 'Claremont-M-S', 'CMS', 'claremont-mudd-scripps', 'Stags', 'SCIAC', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Zinda Field', 'Claremont', 'CA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Occidental Tigers', 'Occidental', 'OXYD', 'occidental', 'Tigers', 'SCIAC', NULL, 'D3', '#FF6600', '#000000', NULL, 'Jack Kemp Stadium', 'Los Angeles', 'CA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Pomona-Pitzer Sagehens', 'Pomona-Pitzer', 'POMP', 'pomona-pitzer', 'Sagehens', 'SCIAC', NULL, 'D3', '#003399', '#FF6600', NULL, 'Sagehen Stadium', 'Claremont', 'CA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Redlands Bulldogs', 'Redlands', 'RDLD', 'redlands', 'Bulldogs', 'SCIAC', NULL, 'D3', '#8B0000', '#808080', NULL, 'Ted Runner Stadium', 'Redlands', 'CA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Whittier Poets', 'Whittier', 'WHTR', 'whittier', 'Poets', 'SCIAC', NULL, 'D3', '#4B0082', '#CFB53B', NULL, 'Memorial Stadium', 'Whittier', 'CA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Chapman Panthers', 'Chapman', 'CHAP', 'chapman', 'Panthers', 'SCIAC', NULL, 'D3', '#CC0000', '#000000', NULL, 'Wilson Field', 'Orange', 'CA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('La Verne Leopards', 'La Verne', 'LVRN', 'la-verne', 'Leopards', 'SCIAC', NULL, 'D3', '#006633', '#FF6600', NULL, 'Ortmayer Stadium', 'La Verne', 'CA', false);

-- =============================================================================
-- Liberty League - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hobart Statesmen', 'Hobart', 'HOBT', 'hobart', 'Statesmen', 'Liberty League', NULL, 'D3', '#4B0082', '#FF6600', NULL, 'Boswell Field', 'Geneva', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Ithaca Bombers', 'Ithaca', 'ITHC', 'ithaca', 'Bombers', 'Liberty League', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Butterfield Stadium', 'Ithaca', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('RPI Engineers', 'RPI', 'RPI', 'rpi', 'Engineers', 'Liberty League', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'East Campus Stadium', 'Troy', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Rochester Yellowjackets', 'Rochester', 'ROCH', 'rochester', 'Yellowjackets', 'Liberty League', NULL, 'D3', '#003399', '#FFD700', NULL, 'Fauver Stadium', 'Rochester', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('St. Lawrence Saints', 'St. Lawrence', 'STLW', 'st-lawrence', 'Saints', 'Liberty League', NULL, 'D3', '#CC0000', '#663300', NULL, 'Appleton Arena Field', 'Canton', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Union Dutchmen', 'Union (NY)', 'UNNY', 'union-ny', 'Dutchmen', 'Liberty League', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Frank Bailey Field', 'Schenectady', 'NY', false);

-- =============================================================================
-- Empire 8 - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Alfred Saxons', 'Alfred', 'ALFD', 'alfred', 'Saxons', 'Empire 8', NULL, 'D3', '#4B0082', '#CFB53B', NULL, 'Yunevich Stadium', 'Alfred', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Brockport Golden Eagles', 'Brockport', 'BROC', 'brockport', 'Golden Eagles', 'Empire 8', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Bob Boozer Field', 'Brockport', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Buffalo State Bengals', 'Buffalo State', 'BFST', 'buffalo-state', 'Bengals', 'Empire 8', NULL, 'D3', '#FF6600', '#000000', NULL, 'Coyer Field', 'Buffalo', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Cortland Red Dragons', 'Cortland', 'CORT', 'cortland', 'Red Dragons', 'Empire 8', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Stadium Complex', 'Cortland', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hartwick Hawks', 'Hartwick', 'HRTW', 'hartwick', 'Hawks', 'Empire 8', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Wright Stadium', 'Oneonta', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Morrisville State Mustangs', 'Morrisville State', 'MORL', 'morrisville-state', 'Mustangs', 'Empire 8', NULL, 'D3', '#006633', '#FFFFFF', NULL, 'Drake Field', 'Morrisville', 'NY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Utica Pioneers', 'Utica', 'UTIC', 'utica', 'Pioneers', 'Empire 8', NULL, 'D3', '#003399', '#FF6600', NULL, 'Gaetano Stadium', 'Utica', 'NY', false);

-- =============================================================================
-- Midwest Conference - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Beloit Buccaneers', 'Beloit', 'BELO', 'beloit', 'Buccaneers', 'Midwest', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Strong Stadium', 'Beloit', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Cornell Rams', 'Cornell (IA)', 'CRIA', 'cornell-ia', 'Rams', 'Midwest', NULL, 'D3', '#4B0082', '#FFFFFF', NULL, 'Ash Park', 'Mount Vernon', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Grinnell Pioneers', 'Grinnell', 'GRIN', 'grinnell', 'Pioneers', 'Midwest', NULL, 'D3', '#CC0000', '#000000', NULL, 'Rosenbloom Field', 'Grinnell', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Illinois College Blueboys', 'Illinois College', 'ILCO', 'illinois-college', 'Blueboys', 'Midwest', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'IL College Stadium', 'Jacksonville', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Knox Prairie Fire', 'Knox', 'KNOX', 'knox', 'Prairie Fire', 'Midwest', NULL, 'D3', '#4B0082', '#FF6600', NULL, 'Knosher Bowl', 'Galesburg', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Lake Forest Foresters', 'Lake Forest', 'LKFR', 'lake-forest', 'Foresters', 'Midwest', NULL, 'D3', '#CC0000', '#000000', NULL, 'Farwell Field', 'Lake Forest', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Lawrence Vikings', 'Lawrence', 'LAWR', 'lawrence', 'Vikings', 'Midwest', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Banta Bowl', 'Appleton', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Monmouth Scots', 'Monmouth (IL)', 'MNIL', 'monmouth-il', 'Scots', 'Midwest', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'April Zorn Memorial Stadium', 'Monmouth', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Ripon Red Hawks', 'Ripon', 'RIPN', 'ripon', 'Red Hawks', 'Midwest', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Ingalls Field', 'Ripon', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('St. Norbert Green Knights', 'St. Norbert', 'STNB', 'st-norbert', 'Green Knights', 'Midwest', NULL, 'D3', '#006633', '#FFFFFF', NULL, 'Schneider Stadium', 'De Pere', 'WI', false);

-- =============================================================================
-- PAC (Presidents Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bethany Bison', 'Bethany (WV)', 'BTWV', 'bethany-wv', 'Bison', 'PAC', NULL, 'D3', '#006633', '#FFFFFF', NULL, 'Bison Stadium', 'Bethany', 'WV', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Geneva Golden Tornadoes', 'Geneva', 'GNVA', 'geneva', 'Golden Tornadoes', 'PAC', NULL, 'D3', '#CFB53B', '#FFFFFF', NULL, 'Reeves Field', 'Beaver Falls', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Grove City Wolverines', 'Grove City', 'GRVC', 'grove-city', 'Wolverines', 'PAC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Thorn Field', 'Grove City', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Saint Vincent Bearcats', 'Saint Vincent', 'STVN', 'saint-vincent', 'Bearcats', 'PAC', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Bearcat Stadium', 'Latrobe', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Thiel Tomcats', 'Thiel', 'THEL', 'thiel', 'Tomcats', 'PAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Robert Weyandt Field', 'Greenville', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Thomas More Saints', 'Thomas More', 'THMO', 'thomas-more', 'Saints', 'PAC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Saints Stadium', 'Crestview Hills', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Washington & Jefferson Presidents', 'Washington & Jefferson', 'WNJ', 'washington-jefferson', 'Presidents', 'PAC', NULL, 'D3', '#CC0000', '#000000', NULL, 'Cameron Stadium', 'Washington', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Waynesburg Yellow Jackets', 'Waynesburg', 'WAYB', 'waynesburg', 'Yellow Jackets', 'PAC', NULL, 'D3', '#FF6600', '#000000', NULL, 'John F. Wiley Stadium', 'Waynesburg', 'PA', false);

-- =============================================================================
-- UMAC (Upper Midwest Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Crown Storm', 'Crown', 'CRWN', 'crown', 'Storm', 'UMAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Crown Field', 'St. Bonifacius', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Eureka Red Devils', 'Eureka', 'EURK', 'eureka', 'Red Devils', 'UMAC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'McKinzie Field', 'Eureka', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Greenville Panthers', 'Greenville', 'GRVL', 'greenville', 'Panthers', 'UMAC', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Greenville Stadium', 'Greenville', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Martin Luther Knights', 'Martin Luther', 'MLKC', 'martin-luther', 'Knights', 'UMAC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'MLC Field', 'New Ulm', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Minnesota Morris Cougars', 'Minnesota Morris', 'UMMR', 'minnesota-morris', 'Cougars', 'UMAC', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Big Cat Stadium', 'Morris', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Northwestern-St. Paul Eagles', 'Northwestern-St. Paul', 'NWSP', 'northwestern-st-paul', 'Eagles', 'UMAC', NULL, 'D3', '#CC0000', '#CFB53B', NULL, 'Northwestern Field', 'St. Paul', 'MN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Westminster Blue Jays', 'Westminster (MO)', 'WMMO', 'westminster-mo', 'Blue Jays', 'UMAC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Priest Field', 'Fulton', 'MO', false);

-- =============================================================================
-- USA South Athletic Conference - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Averett Cougars', 'Averett', 'AVRT', 'averett', 'Cougars', 'USA South', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Frank R. Campbell Stadium', 'Danville', 'VA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Greensboro Pride', 'Greensboro', 'GRBO', 'greensboro', 'Pride', 'USA South', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Greensboro Stadium', 'Greensboro', 'NC', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Huntingdon Hawks', 'Huntingdon', 'HUNT', 'huntingdon', 'Hawks', 'USA South', NULL, 'D3', '#CC0000', '#808080', NULL, 'Hawks Stadium', 'Montgomery', 'AL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('LaGrange Panthers', 'LaGrange', 'LAGR', 'lagrange', 'Panthers', 'USA South', NULL, 'D3', '#CC0000', '#000000', NULL, 'Callaway Stadium', 'LaGrange', 'GA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Methodist Monarchs', 'Methodist', 'METH', 'methodist', 'Monarchs', 'USA South', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Monarchs Stadium', 'Fayetteville', 'NC', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Maryville Scots', 'Maryville (TN)', 'MVTN', 'maryville-tn', 'Scots', 'USA South', NULL, 'D3', '#CC0000', '#808080', NULL, 'Honaker Field', 'Maryville', 'TN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('North Carolina Wesleyan Battling Bishops', 'NC Wesleyan', 'NCWU', 'nc-wesleyan', 'Battling Bishops', 'USA South', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Bishop Stadium', 'Rocky Mount', 'NC', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('William Peace Pacers', 'William Peace', 'WPCE', 'william-peace', 'Pacers', 'USA South', NULL, 'D3', '#FFD700', '#003399', NULL, 'Peace Field', 'Raleigh', 'NC', false);
"""

with open('C:/Users/beltr/cfbsocial/supabase/seed/schools-lower-divisions.sql', 'a', encoding='utf-8') as f:
    f.write(SQL)
print('Batch 2 done')
