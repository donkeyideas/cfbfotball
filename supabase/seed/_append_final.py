#!/usr/bin/env python3
"""Append remaining D3 conferences and missing NAIA teams."""

SQL = """
-- =============================================================================
-- MIAA-D3 (Michigan Intercollegiate Athletic Association) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Adrian Bulldogs', 'Adrian', 'ADRN', 'adrian', 'Bulldogs', 'MIAA-D3', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Docking Stadium', 'Adrian', 'MI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Albion Britons', 'Albion', 'ALBI', 'albion', 'Britons', 'MIAA-D3', NULL, 'D3', '#4B0082', '#CFB53B', NULL, 'Sprankle-Sprandel Stadium', 'Albion', 'MI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Alma Scots', 'Alma', 'ALMA', 'alma', 'Scots', 'MIAA-D3', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Bahlke Field', 'Alma', 'MI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Calvin Knights', 'Calvin', 'CLVN', 'calvin', 'Knights', 'MIAA-D3', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Calvin Stadium', 'Grand Rapids', 'MI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hope Flying Dutchmen', 'Hope', 'HOPE', 'hope', 'Flying Dutchmen', 'MIAA-D3', NULL, 'D3', '#FF6600', '#003399', NULL, 'Ray and Sue Smith Stadium', 'Holland', 'MI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Kalamazoo Hornets', 'Kalamazoo', 'KLMZ', 'kalamazoo', 'Hornets', 'MIAA-D3', NULL, 'D3', '#FF6600', '#000000', NULL, 'Angell Field', 'Kalamazoo', 'MI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Olivet Comets', 'Olivet', 'OLIV', 'olivet', 'Comets', 'MIAA-D3', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Cutler Field', 'Olivet', 'MI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Trine Thunder', 'Trine', 'TRIN', 'trine', 'Thunder', 'MIAA-D3', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Fred Zollner Athletic Stadium', 'Angola', 'IN', false);

-- =============================================================================
-- MAC-D3 (Middle Atlantic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Alvernia Golden Wolves', 'Alvernia', 'ALVN', 'alvernia', 'Golden Wolves', 'MAC-D3', NULL, 'D3', '#CC0000', '#CFB53B', NULL, 'Alvernia Stadium', 'Reading', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Delaware Valley Aggies', 'Delaware Valley', 'DLVL', 'delaware-valley', 'Aggies', 'MAC-D3', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Robert A. Lipinski Field', 'Doylestown', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Eastern Wildcats', 'Eastern', 'ESTU', 'eastern-d3', 'Eagles', 'MAC-D3', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Eastern Stadium', 'St. Davids', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('FDU-Florham Devils', 'FDU-Florham', 'FDUF', 'fdu-florham', 'Devils', 'MAC-D3', NULL, 'D3', '#8B0000', '#003399', NULL, 'Cangiano Field', 'Madison', 'NJ', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('King''s Monarchs', 'King''s', 'KNGS', 'kings', 'Monarchs', 'MAC-D3', NULL, 'D3', '#CC0000', '#CFB53B', NULL, 'Monarchs Stadium', 'Wilkes-Barre', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Lebanon Valley Flying Dutchmen', 'Lebanon Valley', 'LBVL', 'lebanon-valley', 'Flying Dutchmen', 'MAC-D3', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Arnold Field', 'Annville', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Lycoming Warriors', 'Lycoming', 'LYCO', 'lycoming', 'Warriors', 'MAC-D3', NULL, 'D3', '#003399', '#CFB53B', NULL, 'David Person Field', 'Williamsport', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Misericordia Cougars', 'Misericordia', 'MISE', 'misericordia', 'Cougars', 'MAC-D3', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Mangelsdorf Field', 'Dallas', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Stevenson Mustangs', 'Stevenson', 'STVS', 'stevenson', 'Mustangs', 'MAC-D3', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Mustang Stadium', 'Owings Mills', 'MD', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Widener Pride', 'Widener', 'WIDN', 'widener', 'Pride', 'MAC-D3', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Leslie C. Quick Jr. Stadium', 'Chester', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Wilkes Colonels', 'Wilkes', 'WLKS', 'wilkes', 'Colonels', 'MAC-D3', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Schmidt Stadium', 'Wilkes-Barre', 'PA', false);

-- =============================================================================
-- HCAC (Heartland Collegiate Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Anderson Ravens', 'Anderson (IN)', 'ANIN', 'anderson-in', 'Ravens', 'HCAC', NULL, 'D3', '#FF6600', '#000000', NULL, 'Macholtz Stadium', 'Anderson', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bluffton Beavers', 'Bluffton', 'BLUF', 'bluffton', 'Beavers', 'HCAC', NULL, 'D3', '#4B0082', '#FFFFFF', NULL, 'Salzman Stadium', 'Bluffton', 'OH', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Defiance Yellow Jackets', 'Defiance', 'DEFI', 'defiance', 'Yellow Jackets', 'HCAC', NULL, 'D3', '#FFD700', '#4B0082', NULL, 'Fred George Stadium', 'Defiance', 'OH', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Earlham Quakers', 'Earlham', 'EARL', 'earlham', 'Quakers', 'HCAC', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Earlham Stadium', 'Richmond', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Franklin Grizzlies', 'Franklin', 'FRKN', 'franklin', 'Grizzlies', 'HCAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Faught Stadium', 'Franklin', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hanover Panthers', 'Hanover', 'HANO', 'hanover', 'Panthers', 'HCAC', NULL, 'D3', '#CC0000', '#003399', NULL, 'Alumni Stadium', 'Hanover', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Manchester Spartans', 'Manchester', 'MNCH', 'manchester', 'Spartans', 'HCAC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Burt Field', 'North Manchester', 'IN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Mount St. Joseph Lions', 'Mount St. Joseph', 'MSJL', 'mount-st-joseph', 'Lions', 'HCAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Lions Field', 'Cincinnati', 'OH', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Rose-Hulman Fightin'' Engineers', 'Rose-Hulman', 'ROHU', 'rose-hulman', 'Fightin'' Engineers', 'HCAC', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Phil Brown Field', 'Terre Haute', 'IN', false);

-- =============================================================================
-- NACC (Northern Athletics Collegiate Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Aurora Spartans', 'Aurora', 'AURO', 'aurora', 'Spartans', 'NACC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Spartan Field', 'Aurora', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Benedictine Eagles', 'Benedictine (IL)', 'BNIL', 'benedictine-il', 'Eagles', 'NACC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Benedictine Field', 'Lisle', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Concordia Chicago Cougars', 'Concordia Chicago', 'CCHI', 'concordia-chicago', 'Cougars', 'NACC', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Concordia Stadium', 'River Forest', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Concordia Wisconsin Falcons', 'Concordia Wisconsin', 'CWIS', 'concordia-wisconsin', 'Falcons', 'NACC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Concordia Field', 'Mequon', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Dominican Stars', 'Dominican (IL)', 'DMIL', 'dominican-il', 'Stars', 'NACC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Dominican Field', 'River Forest', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Lakeland Muskies', 'Lakeland', 'LKLD', 'lakeland', 'Muskies', 'NACC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Lakeland Stadium', 'Sheboygan', 'WI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Rockford Regents', 'Rockford', 'RKFD', 'rockford', 'Regents', 'NACC', NULL, 'D3', '#4B0082', '#CFB53B', NULL, 'Rockford Stadium', 'Rockford', 'IL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Wisconsin Lutheran Warriors', 'Wisconsin Lutheran', 'WLUT', 'wisconsin-lutheran', 'Warriors', 'NACC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Raabe Stadium', 'Milwaukee', 'WI', false);

-- =============================================================================
-- SAA (Southern Athletic Association) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Berry Vikings', 'Berry', 'BERY', 'berry', 'Vikings', 'SAA', NULL, 'D3', '#003399', '#C0C0C0', NULL, 'Richards Field', 'Mount Berry', 'GA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Birmingham-Southern Panthers', 'Birmingham-Southern', 'BSOU', 'birmingham-southern', 'Panthers', 'SAA', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Panther Stadium', 'Birmingham', 'AL', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Centre Colonels', 'Centre', 'CNTR', 'centre', 'Colonels', 'SAA', NULL, 'D3', '#CFB53B', '#FFFFFF', NULL, 'Farris Stadium', 'Danville', 'KY', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Hendrix Warriors', 'Hendrix', 'HNDX', 'hendrix', 'Warriors', 'SAA', NULL, 'D3', '#FF6600', '#000000', NULL, 'Young Memorial Stadium', 'Conway', 'AR', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Millsaps Majors', 'Millsaps', 'MLSP', 'millsaps', 'Majors', 'SAA', NULL, 'D3', '#4B0082', '#FFFFFF', NULL, 'Harper Davis Field', 'Jackson', 'MS', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Rhodes Lynx', 'Rhodes', 'RHDS', 'rhodes', 'Lynx', 'SAA', NULL, 'D3', '#CC0000', '#000000', NULL, 'Crain Field at Mason Stadium', 'Memphis', 'TN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Sewanee Tigers', 'Sewanee', 'SEWN', 'sewanee', 'Tigers', 'SAA', NULL, 'D3', '#4B0082', '#CFB53B', NULL, 'Harris Stadium', 'Sewanee', 'TN', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Trinity Tigers', 'Trinity (TX)', 'TRTX', 'trinity-tx', 'Tigers', 'SAA', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Trinity Stadium', 'San Antonio', 'TX', false);

-- =============================================================================
-- SCAC (Southern Collegiate Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Austin College Kangaroos', 'Austin College', 'AUCO', 'austin-college', 'Kangaroos', 'SCAC', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Kangaroo Stadium', 'Sherman', 'TX', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Colorado College Tigers', 'Colorado College', 'CCOL', 'colorado-college', 'Tigers', 'SCAC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Washburn Field', 'Colorado Springs', 'CO', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Southwestern Pirates', 'Southwestern (TX)', 'SWTX', 'southwestern-tx', 'Pirates', 'SCAC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Lord Stadium', 'Georgetown', 'TX', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Texas Lutheran Bulldogs', 'Schreiner (SCAC)', 'SCSC', 'schreiner-scac', 'Mountaineers', 'SCAC', NULL, 'D3', '#8B0000', '#808080', NULL, 'Schreiner Field', 'Kerrville', 'TX', false);

-- =============================================================================
-- NEWMAC (New England Women''s and Men''s Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('MIT Engineers', 'MIT', 'MIT', 'mit', 'Engineers', 'NEWMAC', NULL, 'D3', '#8B0000', '#808080', NULL, 'Steinbrenner Stadium', 'Cambridge', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('WPI Engineers', 'WPI', 'WPI', 'wpi', 'Engineers', 'NEWMAC', NULL, 'D3', '#8B0000', '#808080', NULL, 'Alumni Stadium', 'Worcester', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Springfield Pride', 'Springfield', 'SPGF', 'springfield', 'Pride', 'NEWMAC', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Stagg Field', 'Springfield', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Coast Guard Bears', 'Coast Guard', 'USCG', 'coast-guard', 'Bears', 'NEWMAC', NULL, 'D3', '#003399', '#FF6600', NULL, 'Cadet Memorial Field', 'New London', 'CT', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Merchant Marine Mariners', 'Merchant Marine', 'USMM', 'merchant-marine', 'Mariners', 'NEWMAC', NULL, 'D3', '#003399', '#808080', NULL, 'Tomb Field', 'Kings Point', 'NY', false);

-- =============================================================================
-- NWC (Northwest Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('George Fox Bruins', 'George Fox', 'GFOX', 'george-fox', 'Bruins', 'NWC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Stoffer Family Stadium', 'Newberg', 'OR', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Lewis & Clark Pioneers', 'Lewis & Clark', 'LWCK', 'lewis-clark', 'Pioneers', 'NWC', NULL, 'D3', '#FF6600', '#000000', NULL, 'Griswold Stadium', 'Portland', 'OR', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Linfield Wildcats', 'Linfield', 'LINF', 'linfield', 'Wildcats', 'NWC', NULL, 'D3', '#4B0082', '#CC0000', NULL, 'Maxwell Field', 'McMinnville', 'OR', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Pacific Lutheran Lutes', 'Pacific Lutheran', 'PLU', 'pacific-lutheran', 'Lutes', 'NWC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Sparks Stadium', 'Tacoma', 'WA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Pacific Boxers', 'Pacific (OR)', 'PAOR', 'pacific-or', 'Boxers', 'NWC', NULL, 'D3', '#CC0000', '#000000', NULL, 'Pacific Stadium', 'Forest Grove', 'OR', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Puget Sound Loggers', 'Puget Sound', 'PUGS', 'puget-sound', 'Loggers', 'NWC', NULL, 'D3', '#8B0000', '#CFB53B', NULL, 'Baker Stadium', 'Tacoma', 'WA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Whitworth Pirates', 'Whitworth', 'WHWT', 'whitworth', 'Pirates', 'NWC', NULL, 'D3', '#8B0000', '#FFFFFF', NULL, 'Pine Bowl', 'Spokane', 'WA', false);

-- =============================================================================
-- CofNE (Commonwealth of New England) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Curry Colonels', 'Curry', 'CURY', 'curry', 'Colonels', 'CofNE', NULL, 'D3', '#4B0082', '#CFB53B', NULL, 'Curry Field', 'Milton', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Nichols Bison', 'Nichols', 'NICH2', 'nichols', 'Bison', 'CofNE', NULL, 'D3', '#006633', '#FFFFFF', NULL, 'Vendetti Field', 'Dudley', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Salve Regina Seahawks', 'Salve Regina', 'SLVR', 'salve-regina', 'Seahawks', 'CofNE', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Toppa Field', 'Newport', 'RI', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Western New England Golden Bears', 'Western New England', 'WNEU', 'western-new-england', 'Golden Bears', 'CofNE', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Golden Bear Stadium', 'Springfield', 'MA', false);

-- =============================================================================
-- MASCAC (Massachusetts State Collegiate Athletic Conference) - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bridgewater State Bears', 'Bridgewater State', 'BRST', 'bridgewater-state', 'Bears', 'MASCAC', NULL, 'D3', '#CC0000', '#FFFFFF', NULL, 'Alumni Park', 'Bridgewater', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Fitchburg State Falcons', 'Fitchburg State', 'FTST', 'fitchburg-state', 'Falcons', 'MASCAC', NULL, 'D3', '#006633', '#CFB53B', NULL, 'Elliot Field', 'Fitchburg', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Framingham State Rams', 'Framingham State', 'FRMG', 'framingham-state', 'Rams', 'MASCAC', NULL, 'D3', '#000000', '#CFB53B', NULL, 'Bowditch Field', 'Framingham', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Massachusetts Maritime Buccaneers', 'Mass Maritime', 'MMAC', 'mass-maritime', 'Buccaneers', 'MASCAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Clean Harbors Stadium', 'Buzzards Bay', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Plymouth State Panthers', 'Plymouth State', 'PLST', 'plymouth-state', 'Panthers', 'MASCAC', NULL, 'D3', '#006633', '#FFFFFF', NULL, 'ALLWell North Field', 'Plymouth', 'NH', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Worcester State Lancers', 'Worcester State', 'WRST', 'worcester-state', 'Lancers', 'MASCAC', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Worcester State Field', 'Worcester', 'MA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Westfield State Owls', 'Westfield State', 'WFST', 'westfield-state', 'Owls', 'MASCAC', NULL, 'D3', '#003399', '#FFFFFF', NULL, 'Alumni Field', 'Westfield', 'MA', false);

-- =============================================================================
-- Landmark Conference - D3
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Catholic Cardinals', 'Catholic', 'CATH', 'catholic', 'Cardinals', 'Landmark', NULL, 'D3', '#CC0000', '#000000', NULL, 'Cardinal Stadium', 'Washington', 'DC', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Goucher Gophers', 'Goucher', 'GOUC', 'goucher', 'Gophers', 'Landmark', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Goucher Field', 'Towson', 'MD', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Juniata Eagles', 'Juniata', 'JUNI', 'juniata', 'Eagles', 'Landmark', NULL, 'D3', '#003399', '#CFB53B', NULL, 'Knox Stadium', 'Huntingdon', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Moravian Greyhounds', 'Moravian', 'MORV', 'moravian', 'Greyhounds', 'Landmark', NULL, 'D3', '#003399', '#808080', NULL, 'Steel Field', 'Bethlehem', 'PA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Susquehanna River Hawks', 'Susquehanna', 'SUSQ', 'susquehanna', 'River Hawks', 'Landmark', NULL, 'D3', '#FF6600', '#8B0000', NULL, 'Amos Alonzo Stagg Field', 'Selinsgrove', 'PA', false);

-- =============================================================================
-- Additional NAIA: Waldorf (GPAC) and Mayville State (Frontier)
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Waldorf Warriors', 'Waldorf', 'WLDF', 'waldorf', 'Warriors', 'GPAC', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'Waldorf Stadium', 'Forest City', 'IA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Mayville State Comets', 'Mayville State', 'MYVL', 'mayville-state', 'Comets', 'Frontier', NULL, 'NAIA', '#003399', '#FFFFFF', NULL, 'Swisher Field', 'Mayville', 'ND', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Simpson Red Hawks', 'Simpson (CA)', 'SMPCA', 'simpson-ca', 'Red Hawks', 'Frontier', NULL, 'NAIA', '#CC0000', '#000000', NULL, 'Simpson Field', 'Redding', 'CA', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Missouri Baptist Spartans', 'Missouri Baptist', 'MOBT', 'missouri-baptist', 'Spartans', 'Heart of America', NULL, 'NAIA', '#003399', '#CC0000', NULL, 'MoBap Field', 'St. Louis', 'MO', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Central Methodist Eagles', 'Central Methodist', 'CMTH', 'central-methodist', 'Eagles', 'Heart of America', NULL, 'NAIA', '#CC0000', '#FFFFFF', NULL, 'Parkin Field', 'Fayette', 'MO', false);

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Peru State Bobcats', 'Peru State', 'PERU', 'peru-state', 'Bobcats', 'Heart of America', NULL, 'NAIA', '#003399', '#CFB53B', NULL, 'Oak Bowl', 'Peru', 'NE', false);
"""

with open('C:/Users/beltr/cfbsocial/supabase/seed/schools-lower-divisions.sql', 'a', encoding='utf-8') as f:
    f.write(SQL)
print('Final batch done')
