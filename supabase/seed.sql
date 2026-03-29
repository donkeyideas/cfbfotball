-- =============================================================================
-- CFBSocial Seed Data: ALL College Football Programs (2025 Season)
-- 653 teams: 136 FBS + 124 FCS + 170 D2 + 149 D3 + 74 NAIA
-- =============================================================================
-- This file: FBS + FCS (260 teams)
-- Lower divisions: seed/schools-lower-divisions.sql (393 teams)
-- Run BOTH files to seed all teams
-- =============================================================================

-- Truncate existing data (safe for re-seeding)
TRUNCATE TABLE schools CASCADE;

-- =============================================================================
-- FBS: SEC (Southeastern Conference) - 16 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Alabama Crimson Tide', 'Alabama', 'BAMA', 'alabama', 'Crimson Tide', 'SEC', NULL, 'FBS', '#9E1B32', '#828A8F', NULL, 'Bryant-Denny Stadium', 'Tuscaloosa', 'AL', true),
('Arkansas Razorbacks', 'Arkansas', 'ARK', 'arkansas', 'Razorbacks', 'SEC', NULL, 'FBS', '#9D2235', '#000000', NULL, 'Donald W. Reynolds Razorback Stadium', 'Fayetteville', 'AR', true),
('Auburn Tigers', 'Auburn', 'AUB', 'auburn', 'Tigers', 'SEC', NULL, 'FBS', '#0C2340', '#E87722', NULL, 'Jordan-Hare Stadium', 'Auburn', 'AL', true),
('Florida Gators', 'Florida', 'UF', 'florida', 'Gators', 'SEC', NULL, 'FBS', '#0021A5', '#FA4616', NULL, 'Ben Hill Griffin Stadium', 'Gainesville', 'FL', true),
('Georgia Bulldogs', 'Georgia', 'UGA', 'georgia', 'Bulldogs', 'SEC', NULL, 'FBS', '#BA0C2F', '#000000', NULL, 'Sanford Stadium', 'Athens', 'GA', true),
('Kentucky Wildcats', 'Kentucky', 'UK', 'kentucky', 'Wildcats', 'SEC', NULL, 'FBS', '#0033A0', '#FFFFFF', NULL, 'Kroger Field', 'Lexington', 'KY', true),
('LSU Tigers', 'LSU', 'LSU', 'lsu', 'Tigers', 'SEC', NULL, 'FBS', '#461D7C', '#FDD023', NULL, 'Tiger Stadium', 'Baton Rouge', 'LA', true),
('Ole Miss Rebels', 'Ole Miss', 'MISS', 'ole-miss', 'Rebels', 'SEC', NULL, 'FBS', '#CE1126', '#14213D', NULL, 'Vaught-Hemingway Stadium', 'Oxford', 'MS', true),
('Mississippi State Bulldogs', 'Mississippi State', 'MSST', 'mississippi-state', 'Bulldogs', 'SEC', NULL, 'FBS', '#660000', '#FFFFFF', NULL, 'Davis Wade Stadium', 'Starkville', 'MS', true),
('Missouri Tigers', 'Missouri', 'MIZ', 'missouri', 'Tigers', 'SEC', NULL, 'FBS', '#F1B82D', '#000000', NULL, 'Faurot Field at Memorial Stadium', 'Columbia', 'MO', true),
('Oklahoma Sooners', 'Oklahoma', 'OU', 'oklahoma', 'Sooners', 'SEC', NULL, 'FBS', '#841617', '#FDF9D8', NULL, 'Gaylord Family Oklahoma Memorial Stadium', 'Norman', 'OK', true),
('South Carolina Gamecocks', 'South Carolina', 'SC', 'south-carolina', 'Gamecocks', 'SEC', NULL, 'FBS', '#73000A', '#000000', NULL, 'Williams-Brice Stadium', 'Columbia', 'SC', true),
('Tennessee Volunteers', 'Tennessee', 'TENN', 'tennessee', 'Volunteers', 'SEC', NULL, 'FBS', '#FF8200', '#58595B', NULL, 'Neyland Stadium', 'Knoxville', 'TN', true),
('Texas Longhorns', 'Texas', 'TEX', 'texas', 'Longhorns', 'SEC', NULL, 'FBS', '#BF5700', '#FFFFFF', NULL, 'Darrell K Royal-Texas Memorial Stadium', 'Austin', 'TX', true),
('Texas A&M Aggies', 'Texas A&M', 'TAMU', 'texas-am', 'Aggies', 'SEC', NULL, 'FBS', '#500000', '#FFFFFF', NULL, 'Kyle Field', 'College Station', 'TX', true),
('Vanderbilt Commodores', 'Vanderbilt', 'VAN', 'vanderbilt', 'Commodores', 'SEC', NULL, 'FBS', '#866D4B', '#000000', NULL, 'FirstBank Stadium', 'Nashville', 'TN', true);

-- =============================================================================
-- FBS: Big Ten Conference - 18 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Illinois Fighting Illini', 'Illinois', 'ILL', 'illinois', 'Fighting Illini', 'Big Ten', NULL, 'FBS', '#E84A27', '#13294B', NULL, 'Memorial Stadium', 'Champaign', 'IL', true),
('Indiana Hoosiers', 'Indiana', 'IND', 'indiana', 'Hoosiers', 'Big Ten', NULL, 'FBS', '#990000', '#EEEDEB', NULL, 'Memorial Stadium', 'Bloomington', 'IN', true),
('Iowa Hawkeyes', 'Iowa', 'IOWA', 'iowa', 'Hawkeyes', 'Big Ten', NULL, 'FBS', '#000000', '#FFCD00', NULL, 'Kinnick Stadium', 'Iowa City', 'IA', true),
('Maryland Terrapins', 'Maryland', 'MD', 'maryland', 'Terrapins', 'Big Ten', NULL, 'FBS', '#E03A3E', '#FFD520', NULL, 'SECU Stadium', 'College Park', 'MD', true),
('Michigan Wolverines', 'Michigan', 'MICH', 'michigan', 'Wolverines', 'Big Ten', NULL, 'FBS', '#00274C', '#FFCB05', NULL, 'Michigan Stadium', 'Ann Arbor', 'MI', true),
('Michigan State Spartans', 'Michigan State', 'MSU', 'michigan-state', 'Spartans', 'Big Ten', NULL, 'FBS', '#18453B', '#FFFFFF', NULL, 'Spartan Stadium', 'East Lansing', 'MI', true),
('Minnesota Golden Gophers', 'Minnesota', 'MINN', 'minnesota', 'Golden Gophers', 'Big Ten', NULL, 'FBS', '#7A0019', '#FFCC33', NULL, 'Huntington Bank Stadium', 'Minneapolis', 'MN', true),
('Nebraska Cornhuskers', 'Nebraska', 'NEB', 'nebraska', 'Cornhuskers', 'Big Ten', NULL, 'FBS', '#E41C38', '#F5F1E7', NULL, 'Memorial Stadium', 'Lincoln', 'NE', true),
('Northwestern Wildcats', 'Northwestern', 'NW', 'northwestern', 'Wildcats', 'Big Ten', NULL, 'FBS', '#4E2A84', '#000000', NULL, 'Ryan Field', 'Evanston', 'IL', true),
('Ohio State Buckeyes', 'Ohio State', 'OSU', 'ohio-state', 'Buckeyes', 'Big Ten', NULL, 'FBS', '#BB0000', '#666666', NULL, 'Ohio Stadium', 'Columbus', 'OH', true),
('Oregon Ducks', 'Oregon', 'ORE', 'oregon', 'Ducks', 'Big Ten', NULL, 'FBS', '#154733', '#FEE123', NULL, 'Autzen Stadium', 'Eugene', 'OR', true),
('Penn State Nittany Lions', 'Penn State', 'PSU', 'penn-state', 'Nittany Lions', 'Big Ten', NULL, 'FBS', '#041E42', '#FFFFFF', NULL, 'Beaver Stadium', 'University Park', 'PA', true),
('Purdue Boilermakers', 'Purdue', 'PUR', 'purdue', 'Boilermakers', 'Big Ten', NULL, 'FBS', '#CEB888', '#000000', NULL, 'Ross-Ade Stadium', 'West Lafayette', 'IN', true),
('Rutgers Scarlet Knights', 'Rutgers', 'RUT', 'rutgers', 'Scarlet Knights', 'Big Ten', NULL, 'FBS', '#CC0033', '#5F6A72', NULL, 'SHI Stadium', 'Piscataway', 'NJ', true),
('UCLA Bruins', 'UCLA', 'UCLA', 'ucla', 'Bruins', 'Big Ten', NULL, 'FBS', '#2D68C4', '#F2A900', NULL, 'Rose Bowl', 'Pasadena', 'CA', true),
('USC Trojans', 'USC', 'USC', 'usc', 'Trojans', 'Big Ten', NULL, 'FBS', '#990000', '#FFC72C', NULL, 'Los Angeles Memorial Coliseum', 'Los Angeles', 'CA', true),
('Washington Huskies', 'Washington', 'UW', 'washington', 'Huskies', 'Big Ten', NULL, 'FBS', '#4B2E83', '#B7A57A', NULL, 'Husky Stadium', 'Seattle', 'WA', true),
('Wisconsin Badgers', 'Wisconsin', 'WIS', 'wisconsin', 'Badgers', 'Big Ten', NULL, 'FBS', '#C5050C', '#FFFFFF', NULL, 'Camp Randall Stadium', 'Madison', 'WI', true);

-- =============================================================================
-- FBS: ACC (Atlantic Coast Conference) - 17 football teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Boston College Eagles', 'Boston College', 'BC', 'boston-college', 'Eagles', 'ACC', NULL, 'FBS', '#98002E', '#BC9B6A', NULL, 'Alumni Stadium', 'Chestnut Hill', 'MA', true),
('California Golden Bears', 'California', 'CAL', 'california', 'Golden Bears', 'ACC', NULL, 'FBS', '#003262', '#FDB515', NULL, 'California Memorial Stadium', 'Berkeley', 'CA', true),
('Clemson Tigers', 'Clemson', 'CLEM', 'clemson', 'Tigers', 'ACC', NULL, 'FBS', '#F56600', '#522D80', NULL, 'Memorial Stadium', 'Clemson', 'SC', true),
('Duke Blue Devils', 'Duke', 'DUKE', 'duke', 'Blue Devils', 'ACC', NULL, 'FBS', '#003087', '#FFFFFF', NULL, 'Wallace Wade Stadium', 'Durham', 'NC', true),
('Florida State Seminoles', 'Florida State', 'FSU', 'florida-state', 'Seminoles', 'ACC', NULL, 'FBS', '#782F40', '#CEB888', NULL, 'Doak Campbell Stadium', 'Tallahassee', 'FL', true),
('Georgia Tech Yellow Jackets', 'Georgia Tech', 'GT', 'georgia-tech', 'Yellow Jackets', 'ACC', NULL, 'FBS', '#B3A369', '#003057', NULL, 'Bobby Dodd Stadium', 'Atlanta', 'GA', true),
('Louisville Cardinals', 'Louisville', 'LOU', 'louisville', 'Cardinals', 'ACC', NULL, 'FBS', '#AD0000', '#000000', NULL, 'L&N Federal Credit Union Stadium', 'Louisville', 'KY', true),
('Miami Hurricanes', 'Miami', 'MIA', 'miami', 'Hurricanes', 'ACC', NULL, 'FBS', '#005030', '#F47321', NULL, 'Hard Rock Stadium', 'Miami Gardens', 'FL', true),
('North Carolina Tar Heels', 'North Carolina', 'UNC', 'north-carolina', 'Tar Heels', 'ACC', NULL, 'FBS', '#7BAFD4', '#13294B', NULL, 'Kenan Memorial Stadium', 'Chapel Hill', 'NC', true),
('NC State Wolfpack', 'NC State', 'NCST', 'nc-state', 'Wolfpack', 'ACC', NULL, 'FBS', '#CC0000', '#000000', NULL, 'Carter-Finley Stadium', 'Raleigh', 'NC', true),
('Pittsburgh Panthers', 'Pittsburgh', 'PITT', 'pittsburgh', 'Panthers', 'ACC', NULL, 'FBS', '#003594', '#FFB81C', NULL, 'Acrisure Stadium', 'Pittsburgh', 'PA', true),
('SMU Mustangs', 'SMU', 'SMU', 'smu', 'Mustangs', 'ACC', NULL, 'FBS', '#0033A0', '#C8102E', NULL, 'Gerald J. Ford Stadium', 'Dallas', 'TX', true),
('Stanford Cardinal', 'Stanford', 'STAN', 'stanford', 'Cardinal', 'ACC', NULL, 'FBS', '#8C1515', '#FFFFFF', NULL, 'Stanford Stadium', 'Stanford', 'CA', true),
('Syracuse Orange', 'Syracuse', 'SYR', 'syracuse', 'Orange', 'ACC', NULL, 'FBS', '#F76900', '#000E54', NULL, 'JMA Wireless Dome', 'Syracuse', 'NY', true),
('Virginia Cavaliers', 'Virginia', 'UVA', 'virginia', 'Cavaliers', 'ACC', NULL, 'FBS', '#232D4B', '#F84C1E', NULL, 'Scott Stadium', 'Charlottesville', 'VA', true),
('Virginia Tech Hokies', 'Virginia Tech', 'VT', 'virginia-tech', 'Hokies', 'ACC', NULL, 'FBS', '#630031', '#CF4420', NULL, 'Lane Stadium', 'Blacksburg', 'VA', true),
('Wake Forest Demon Deacons', 'Wake Forest', 'WAKE', 'wake-forest', 'Demon Deacons', 'ACC', NULL, 'FBS', '#9E7E38', '#000000', NULL, 'Allegacy Federal Credit Union Stadium', 'Winston-Salem', 'NC', true);

-- =============================================================================
-- FBS: Big 12 Conference - 16 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Arizona Wildcats', 'Arizona', 'ARIZ', 'arizona', 'Wildcats', 'Big 12', NULL, 'FBS', '#CC0033', '#003366', NULL, 'Arizona Stadium', 'Tucson', 'AZ', true),
('Arizona State Sun Devils', 'Arizona State', 'ASU', 'arizona-state', 'Sun Devils', 'Big 12', NULL, 'FBS', '#8C1D40', '#FFC627', NULL, 'Mountain America Stadium', 'Tempe', 'AZ', true),
('Baylor Bears', 'Baylor', 'BAY', 'baylor', 'Bears', 'Big 12', NULL, 'FBS', '#003015', '#FECB00', NULL, 'McLane Stadium', 'Waco', 'TX', true),
('BYU Cougars', 'BYU', 'BYU', 'byu', 'Cougars', 'Big 12', NULL, 'FBS', '#002E5D', '#FFFFFF', NULL, 'LaVell Edwards Stadium', 'Provo', 'UT', true),
('UCF Knights', 'UCF', 'UCF', 'ucf', 'Knights', 'Big 12', NULL, 'FBS', '#000000', '#FFC904', NULL, 'FBC Mortgage Stadium', 'Orlando', 'FL', true),
('Cincinnati Bearcats', 'Cincinnati', 'CIN', 'cincinnati', 'Bearcats', 'Big 12', NULL, 'FBS', '#E00122', '#000000', NULL, 'Nippert Stadium', 'Cincinnati', 'OH', true),
('Colorado Buffaloes', 'Colorado', 'COL', 'colorado', 'Buffaloes', 'Big 12', NULL, 'FBS', '#CFB87C', '#000000', NULL, 'Folsom Field', 'Boulder', 'CO', true),
('Houston Cougars', 'Houston', 'HOU', 'houston', 'Cougars', 'Big 12', NULL, 'FBS', '#C8102E', '#FFFFFF', NULL, 'TDECU Stadium', 'Houston', 'TX', true),
('Iowa State Cyclones', 'Iowa State', 'ISU', 'iowa-state', 'Cyclones', 'Big 12', NULL, 'FBS', '#C8102E', '#F1BE48', NULL, 'Jack Trice Stadium', 'Ames', 'IA', true),
('Kansas Jayhawks', 'Kansas', 'KU', 'kansas', 'Jayhawks', 'Big 12', NULL, 'FBS', '#0051BA', '#E8000D', NULL, 'David Booth Kansas Memorial Stadium', 'Lawrence', 'KS', true),
('Kansas State Wildcats', 'Kansas State', 'KSU', 'kansas-state', 'Wildcats', 'Big 12', NULL, 'FBS', '#512888', '#FFFFFF', NULL, 'Bill Snyder Family Stadium', 'Manhattan', 'KS', true),
('Oklahoma State Cowboys', 'Oklahoma State', 'OKST', 'oklahoma-state', 'Cowboys', 'Big 12', NULL, 'FBS', '#FF7300', '#000000', NULL, 'Boone Pickens Stadium', 'Stillwater', 'OK', true),
('TCU Horned Frogs', 'TCU', 'TCU', 'tcu', 'Horned Frogs', 'Big 12', NULL, 'FBS', '#4D1979', '#A3A9AC', NULL, 'Amon G. Carter Stadium', 'Fort Worth', 'TX', true),
('Texas Tech Red Raiders', 'Texas Tech', 'TTU', 'texas-tech', 'Red Raiders', 'Big 12', NULL, 'FBS', '#CC0000', '#000000', NULL, 'Jones AT&T Stadium', 'Lubbock', 'TX', true),
('Utah Utes', 'Utah', 'UTAH', 'utah', 'Utes', 'Big 12', NULL, 'FBS', '#CC0000', '#FFFFFF', NULL, 'Rice-Eccles Stadium', 'Salt Lake City', 'UT', true),
('West Virginia Mountaineers', 'West Virginia', 'WVU', 'west-virginia', 'Mountaineers', 'Big 12', NULL, 'FBS', '#002855', '#EAAA00', NULL, 'Mountaineer Field at Milan Puskar Stadium', 'Morgantown', 'WV', true);

-- =============================================================================
-- FBS: American Athletic Conference (AAC) - 14 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Army Black Knights', 'Army', 'ARMY', 'army', 'Black Knights', 'American', NULL, 'FBS', '#000000', '#D3BC8D', NULL, 'Michie Stadium', 'West Point', 'NY', true),
('Charlotte 49ers', 'Charlotte', 'CLT', 'charlotte', '49ers', 'American', NULL, 'FBS', '#005035', '#A49665', NULL, 'Jerry Richardson Stadium', 'Charlotte', 'NC', true),
('East Carolina Pirates', 'East Carolina', 'ECU', 'east-carolina', 'Pirates', 'American', NULL, 'FBS', '#592A8A', '#FFC82E', NULL, 'Dowdy-Ficklen Stadium', 'Greenville', 'NC', true),
('FAU Owls', 'FAU', 'FAU', 'fau', 'Owls', 'American', NULL, 'FBS', '#CC0000', '#003366', NULL, 'FAU Stadium', 'Boca Raton', 'FL', true),
('Memphis Tigers', 'Memphis', 'MEM', 'memphis', 'Tigers', 'American', NULL, 'FBS', '#003087', '#898D8D', NULL, 'Simmons Bank Liberty Stadium', 'Memphis', 'TN', true),
('Navy Midshipmen', 'Navy', 'NAVY', 'navy', 'Midshipmen', 'American', NULL, 'FBS', '#00205B', '#C5B783', NULL, 'Navy-Marine Corps Memorial Stadium', 'Annapolis', 'MD', true),
('North Texas Mean Green', 'North Texas', 'UNT', 'north-texas', 'Mean Green', 'American', NULL, 'FBS', '#00853E', '#000000', NULL, 'DATCU Stadium', 'Denton', 'TX', true),
('Rice Owls', 'Rice', 'RICE', 'rice', 'Owls', 'American', NULL, 'FBS', '#002469', '#5E6062', NULL, 'Rice Stadium', 'Houston', 'TX', true),
('South Florida Bulls', 'USF', 'USF', 'south-florida', 'Bulls', 'American', NULL, 'FBS', '#006747', '#CFC493', NULL, 'Raymond James Stadium', 'Tampa', 'FL', true),
('Temple Owls', 'Temple', 'TEM', 'temple', 'Owls', 'American', NULL, 'FBS', '#9D2235', '#A7A9AC', NULL, 'Lincoln Financial Field', 'Philadelphia', 'PA', true),
('Tulane Green Wave', 'Tulane', 'TUL', 'tulane', 'Green Wave', 'American', NULL, 'FBS', '#006747', '#87CEEB', NULL, 'Yulman Stadium', 'New Orleans', 'LA', true),
('Tulsa Golden Hurricane', 'Tulsa', 'TLSA', 'tulsa', 'Golden Hurricane', 'American', NULL, 'FBS', '#002D72', '#C8A14E', NULL, 'H.A. Chapman Stadium', 'Tulsa', 'OK', true),
('UAB Blazers', 'UAB', 'UAB', 'uab', 'Blazers', 'American', NULL, 'FBS', '#1E6B52', '#FFC845', NULL, 'Protective Stadium', 'Birmingham', 'AL', true),
('UTSA Roadrunners', 'UTSA', 'UTSA', 'utsa', 'Roadrunners', 'American', NULL, 'FBS', '#0C2340', '#F47321', NULL, 'Alamodome', 'San Antonio', 'TX', true);

-- =============================================================================
-- FBS: Conference USA (C-USA) - 12 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Delaware Blue Hens', 'Delaware', 'DEL', 'delaware', 'Blue Hens', 'Conference USA', NULL, 'FBS', '#00539F', '#FFD200', NULL, 'Delaware Stadium', 'Newark', 'DE', true),
('FIU Panthers', 'FIU', 'FIU', 'fiu', 'Panthers', 'Conference USA', NULL, 'FBS', '#081E3F', '#B6862C', NULL, 'Riccardo Silva Stadium', 'Miami', 'FL', true),
('Jacksonville State Gamecocks', 'Jacksonville State', 'JVST', 'jacksonville-state', 'Gamecocks', 'Conference USA', NULL, 'FBS', '#CC0000', '#FFFFFF', NULL, 'Burgess-Snow Field at JSU Stadium', 'Jacksonville', 'AL', true),
('Kennesaw State Owls', 'Kennesaw State', 'KENN', 'kennesaw-state', 'Owls', 'Conference USA', NULL, 'FBS', '#FDBB30', '#000000', NULL, 'Fifth Third Bank Stadium', 'Kennesaw', 'GA', true),
('Liberty Flames', 'Liberty', 'LIB', 'liberty', 'Flames', 'Conference USA', NULL, 'FBS', '#002D62', '#C41230', NULL, 'Williams Stadium', 'Lynchburg', 'VA', true),
('Louisiana Tech Bulldogs', 'Louisiana Tech', 'LT', 'louisiana-tech', 'Bulldogs', 'Conference USA', NULL, 'FBS', '#002F8B', '#E31B23', NULL, 'Joe Aillet Stadium', 'Ruston', 'LA', true),
('Middle Tennessee Blue Raiders', 'Middle Tennessee', 'MTSU', 'middle-tennessee', 'Blue Raiders', 'Conference USA', NULL, 'FBS', '#0066CC', '#FFFFFF', NULL, 'Floyd Stadium', 'Murfreesboro', 'TN', true),
('Missouri State Bears', 'Missouri State', 'MOST', 'missouri-state', 'Bears', 'Conference USA', NULL, 'FBS', '#5F0000', '#FFFFFF', NULL, 'Robert W. Plaster Stadium', 'Springfield', 'MO', true),
('New Mexico State Aggies', 'New Mexico State', 'NMSU', 'new-mexico-state', 'Aggies', 'Conference USA', NULL, 'FBS', '#8B0023', '#FFFFFF', NULL, 'Aggie Memorial Stadium', 'Las Cruces', 'NM', true),
('Sam Houston Bearkats', 'Sam Houston', 'SH', 'sam-houston', 'Bearkats', 'Conference USA', NULL, 'FBS', '#F58025', '#FFFFFF', NULL, 'Bowers Stadium', 'Huntsville', 'TX', true),
('UTEP Miners', 'UTEP', 'UTEP', 'utep', 'Miners', 'Conference USA', NULL, 'FBS', '#041E42', '#FF8200', NULL, 'Sun Bowl', 'El Paso', 'TX', true),
('Western Kentucky Hilltoppers', 'Western Kentucky', 'WKU', 'western-kentucky', 'Hilltoppers', 'Conference USA', NULL, 'FBS', '#B01E24', '#FFFFFF', NULL, 'L.T. Smith Stadium', 'Bowling Green', 'KY', true);

-- =============================================================================
-- FBS: MAC (Mid-American Conference) - 13 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Akron Zips', 'Akron', 'AKR', 'akron', 'Zips', 'MAC', NULL, 'FBS', '#041E42', '#A89968', NULL, 'InfoCision Stadium', 'Akron', 'OH', true),
('Ball State Cardinals', 'Ball State', 'BALL', 'ball-state', 'Cardinals', 'MAC', NULL, 'FBS', '#BA0C2F', '#FFFFFF', NULL, 'Scheumann Stadium', 'Muncie', 'IN', true),
('Bowling Green Falcons', 'Bowling Green', 'BGSU', 'bowling-green', 'Falcons', 'MAC', NULL, 'FBS', '#4F2C1D', '#FF7300', NULL, 'Doyt L. Perry Stadium', 'Bowling Green', 'OH', true),
('Buffalo Bulls', 'Buffalo', 'BUFF', 'buffalo', 'Bulls', 'MAC', NULL, 'FBS', '#005BBB', '#FFFFFF', NULL, 'UB Stadium', 'Amherst', 'NY', true),
('Central Michigan Chippewas', 'Central Michigan', 'CMU', 'central-michigan', 'Chippewas', 'MAC', NULL, 'FBS', '#6A0032', '#FFC82E', NULL, 'Kelly/Shorts Stadium', 'Mount Pleasant', 'MI', true),
('Eastern Michigan Eagles', 'Eastern Michigan', 'EMU', 'eastern-michigan', 'Eagles', 'MAC', NULL, 'FBS', '#006633', '#FFFFFF', NULL, 'Rynearson Stadium', 'Ypsilanti', 'MI', true),
('Kent State Golden Flashes', 'Kent State', 'KENT', 'kent-state', 'Golden Flashes', 'MAC', NULL, 'FBS', '#002664', '#EAAB00', NULL, 'Dix Stadium', 'Kent', 'OH', true),
('Miami (OH) RedHawks', 'Miami (OH)', 'M-OH', 'miami-oh', 'RedHawks', 'MAC', NULL, 'FBS', '#C3142D', '#FFFFFF', NULL, 'Yager Stadium', 'Oxford', 'OH', true),
('Northern Illinois Huskies', 'Northern Illinois', 'NIU', 'northern-illinois', 'Huskies', 'MAC', NULL, 'FBS', '#BA0C2F', '#000000', NULL, 'Huskie Stadium', 'DeKalb', 'IL', true),
('Ohio Bobcats', 'Ohio', 'OHIO', 'ohio', 'Bobcats', 'MAC', NULL, 'FBS', '#00694E', '#CFC493', NULL, 'Peden Stadium', 'Athens', 'OH', true),
('Toledo Rockets', 'Toledo', 'TOL', 'toledo', 'Rockets', 'MAC', NULL, 'FBS', '#002657', '#EAAB00', NULL, 'Glass Bowl', 'Toledo', 'OH', true),
('UMass Minutemen', 'UMass', 'MASS', 'umass', 'Minutemen', 'MAC', NULL, 'FBS', '#881C1C', '#000000', NULL, 'Warren McGuirk Alumni Stadium', 'Amherst', 'MA', true),
('Western Michigan Broncos', 'Western Michigan', 'WMU', 'western-michigan', 'Broncos', 'MAC', NULL, 'FBS', '#6C4023', '#B5A167', NULL, 'Waldo Stadium', 'Kalamazoo', 'MI', true);

-- =============================================================================
-- FBS: Mountain West Conference - 12 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Air Force Falcons', 'Air Force', 'AF', 'air-force', 'Falcons', 'Mountain West', NULL, 'FBS', '#003087', '#8F8F8C', NULL, 'Falcon Stadium', 'Colorado Springs', 'CO', true),
('Boise State Broncos', 'Boise State', 'BSU', 'boise-state', 'Broncos', 'Mountain West', NULL, 'FBS', '#0033A0', '#D64309', NULL, 'Albertsons Stadium', 'Boise', 'ID', true),
('Colorado State Rams', 'Colorado State', 'CSU', 'colorado-state', 'Rams', 'Mountain West', NULL, 'FBS', '#1E4D2B', '#C8C372', NULL, 'Canvas Stadium', 'Fort Collins', 'CO', true),
('Fresno State Bulldogs', 'Fresno State', 'FRES', 'fresno-state', 'Bulldogs', 'Mountain West', NULL, 'FBS', '#DB0032', '#002E6D', NULL, 'Valley Children''s Stadium', 'Fresno', 'CA', true),
('Hawai''i Rainbow Warriors', 'Hawai''i', 'HAW', 'hawaii', 'Rainbow Warriors', 'Mountain West', NULL, 'FBS', '#024731', '#FFFFFF', NULL, 'Clarence T.C. Ching Athletics Complex', 'Honolulu', 'HI', true),
('Nevada Wolf Pack', 'Nevada', 'NEV', 'nevada', 'Wolf Pack', 'Mountain West', NULL, 'FBS', '#003366', '#A7A8AA', NULL, 'Mackay Stadium', 'Reno', 'NV', true),
('New Mexico Lobos', 'New Mexico', 'UNM', 'new-mexico', 'Lobos', 'Mountain West', NULL, 'FBS', '#BA0C2F', '#A7A8AA', NULL, 'University Stadium', 'Albuquerque', 'NM', true),
('San Diego State Aztecs', 'San Diego State', 'SDSU', 'san-diego-state', 'Aztecs', 'Mountain West', NULL, 'FBS', '#A6192E', '#000000', NULL, 'Snapdragon Stadium', 'San Diego', 'CA', true),
('San Jose State Spartans', 'San Jose State', 'SJSU', 'san-jose-state', 'Spartans', 'Mountain West', NULL, 'FBS', '#0055A2', '#E5A823', NULL, 'CEFCU Stadium', 'San Jose', 'CA', true),
('UNLV Rebels', 'UNLV', 'UNLV', 'unlv', 'Rebels', 'Mountain West', NULL, 'FBS', '#CF0A2C', '#000000', NULL, 'Allegiant Stadium', 'Las Vegas', 'NV', true),
('Utah State Aggies', 'Utah State', 'USU', 'utah-state', 'Aggies', 'Mountain West', NULL, 'FBS', '#0F2439', '#FFFFFF', NULL, 'Maverik Stadium', 'Logan', 'UT', true),
('Wyoming Cowboys', 'Wyoming', 'WYO', 'wyoming', 'Cowboys', 'Mountain West', NULL, 'FBS', '#492F24', '#FFC425', NULL, 'War Memorial Stadium', 'Laramie', 'WY', true);

-- =============================================================================
-- FBS: Sun Belt Conference - 14 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Appalachian State Mountaineers', 'Appalachian State', 'APP', 'appalachian-state', 'Mountaineers', 'Sun Belt', NULL, 'FBS', '#000000', '#FFCC00', NULL, 'Kidd Brewer Stadium', 'Boone', 'NC', true),
('Arkansas State Red Wolves', 'Arkansas State', 'ARST', 'arkansas-state', 'Red Wolves', 'Sun Belt', NULL, 'FBS', '#CC092F', '#000000', NULL, 'Centennial Bank Stadium', 'Jonesboro', 'AR', true),
('Coastal Carolina Chanticleers', 'Coastal Carolina', 'CCU', 'coastal-carolina', 'Chanticleers', 'Sun Belt', NULL, 'FBS', '#006F71', '#A27752', NULL, 'Brooks Stadium', 'Conway', 'SC', true),
('Georgia Southern Eagles', 'Georgia Southern', 'GASO', 'georgia-southern', 'Eagles', 'Sun Belt', NULL, 'FBS', '#011E41', '#A3A9AC', NULL, 'Allen E. Paulson Stadium', 'Statesboro', 'GA', true),
('Georgia State Panthers', 'Georgia State', 'GAST', 'georgia-state', 'Panthers', 'Sun Belt', NULL, 'FBS', '#0039A6', '#CC0000', NULL, 'Center Parc Credit Union Stadium', 'Atlanta', 'GA', true),
('James Madison Dukes', 'James Madison', 'JMU', 'james-madison', 'Dukes', 'Sun Belt', NULL, 'FBS', '#450084', '#CBB677', NULL, 'Bridgeforth Stadium', 'Harrisonburg', 'VA', true),
('Louisiana Ragin'' Cajuns', 'Louisiana', 'ULL', 'louisiana', 'Ragin'' Cajuns', 'Sun Belt', NULL, 'FBS', '#CE181E', '#0A0A0A', NULL, 'Cajun Field', 'Lafayette', 'LA', true),
('Louisiana-Monroe Warhawks', 'Louisiana-Monroe', 'ULM', 'louisiana-monroe', 'Warhawks', 'Sun Belt', NULL, 'FBS', '#840029', '#B99B6B', NULL, 'Malone Stadium', 'Monroe', 'LA', true),
('Marshall Thundering Herd', 'Marshall', 'MRSH', 'marshall', 'Thundering Herd', 'Sun Belt', NULL, 'FBS', '#04945A', '#FFFFFF', NULL, 'Joan C. Edwards Stadium', 'Huntington', 'WV', true),
('Old Dominion Monarchs', 'Old Dominion', 'ODU', 'old-dominion', 'Monarchs', 'Sun Belt', NULL, 'FBS', '#003057', '#A1C1D6', NULL, 'S.B. Ballard Stadium', 'Norfolk', 'VA', true),
('South Alabama Jaguars', 'South Alabama', 'USA', 'south-alabama', 'Jaguars', 'Sun Belt', NULL, 'FBS', '#00205B', '#BF0D3E', NULL, 'Hancock Whitney Stadium', 'Mobile', 'AL', true),
('Southern Miss Golden Eagles', 'Southern Miss', 'USM', 'southern-miss', 'Golden Eagles', 'Sun Belt', NULL, 'FBS', '#000000', '#FFB81C', NULL, 'M.M. Roberts Stadium', 'Hattiesburg', 'MS', true),
('Texas State Bobcats', 'Texas State', 'TXST', 'texas-state', 'Bobcats', 'Sun Belt', NULL, 'FBS', '#501214', '#8D734A', NULL, 'UFCU Stadium', 'San Marcos', 'TX', true),
('Troy Trojans', 'Troy', 'TROY', 'troy', 'Trojans', 'Sun Belt', NULL, 'FBS', '#8B2332', '#A2AAAD', NULL, 'Veterans Memorial Stadium', 'Troy', 'AL', true);

-- =============================================================================
-- FBS: Pac-12 Conference - 2 teams (2025 season)
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Oregon State Beavers', 'Oregon State', 'ORST', 'oregon-state', 'Beavers', 'Pac-12', NULL, 'FBS', '#DC4405', '#000000', NULL, 'Reser Stadium', 'Corvallis', 'OR', true),
('Washington State Cougars', 'Washington State', 'WSU', 'washington-state', 'Cougars', 'Pac-12', NULL, 'FBS', '#981E32', '#5E6A71', NULL, 'Gesa Field at Martin Stadium', 'Pullman', 'WA', true);

-- =============================================================================
-- FBS: Independents - 2 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Notre Dame Fighting Irish', 'Notre Dame', 'ND', 'notre-dame', 'Fighting Irish', 'Independent', NULL, 'FBS', '#0C2340', '#C99700', NULL, 'Notre Dame Stadium', 'Notre Dame', 'IN', true),
('UConn Huskies', 'UConn', 'CONN', 'uconn', 'Huskies', 'Independent', NULL, 'FBS', '#000E2F', '#FFFFFF', NULL, 'Pratt & Whitney Stadium at Rentschler Field', 'East Hartford', 'CT', true);

-- =============================================================================
-- =============================================================================
-- FCS TEAMS BEGIN HERE
-- =============================================================================
-- =============================================================================

-- =============================================================================
-- FCS: Big Sky Conference - 12 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Cal Poly Mustangs', 'Cal Poly', 'CP', 'cal-poly', 'Mustangs', 'Big Sky', NULL, 'FCS', '#154734', '#BD8B13', NULL, 'Alex G. Spanos Stadium', 'San Luis Obispo', 'CA', false),
('Eastern Washington Eagles', 'Eastern Washington', 'EWU', 'eastern-washington', 'Eagles', 'Big Sky', NULL, 'FCS', '#A10022', '#FFFFFF', NULL, 'Roos Field', 'Cheney', 'WA', false),
('Idaho Vandals', 'Idaho', 'IDHO', 'idaho', 'Vandals', 'Big Sky', NULL, 'FCS', '#B5985A', '#000000', NULL, 'Kibbie Dome', 'Moscow', 'ID', false),
('Idaho State Bengals', 'Idaho State', 'IDST', 'idaho-state', 'Bengals', 'Big Sky', NULL, 'FCS', '#FF671F', '#000000', NULL, 'Holt Arena', 'Pocatello', 'ID', false),
('Montana Grizzlies', 'Montana', 'MONT', 'montana', 'Grizzlies', 'Big Sky', NULL, 'FCS', '#660033', '#999999', NULL, 'Washington-Grizzly Stadium', 'Missoula', 'MT', false),
('Montana State Bobcats', 'Montana State', 'MTST', 'montana-state', 'Bobcats', 'Big Sky', NULL, 'FCS', '#003875', '#C5960C', NULL, 'Bobcat Stadium', 'Bozeman', 'MT', false),
('Northern Arizona Lumberjacks', 'Northern Arizona', 'NAU', 'northern-arizona', 'Lumberjacks', 'Big Sky', NULL, 'FCS', '#003466', '#FFD100', NULL, 'J. Lawrence Walkup Skydome', 'Flagstaff', 'AZ', false),
('Northern Colorado Bears', 'Northern Colorado', 'UNCO', 'northern-colorado', 'Bears', 'Big Sky', NULL, 'FCS', '#013C65', '#F0AB00', NULL, 'Nottingham Field', 'Greeley', 'CO', false),
('Portland State Vikings', 'Portland State', 'PRST', 'portland-state', 'Vikings', 'Big Sky', NULL, 'FCS', '#154734', '#FFFFFF', NULL, 'Hillsboro Stadium', 'Hillsboro', 'OR', false),
('Sacramento State Hornets', 'Sacramento State', 'SACST', 'sacramento-state', 'Hornets', 'Big Sky', NULL, 'FCS', '#043927', '#C4B581', NULL, 'Hornet Stadium', 'Sacramento', 'CA', false),
('UC Davis Aggies', 'UC Davis', 'UCD', 'uc-davis', 'Aggies', 'Big Sky', NULL, 'FCS', '#002855', '#B3A369', NULL, 'UC Davis Health Stadium', 'Davis', 'CA', false),
('Weber State Wildcats', 'Weber State', 'WBST', 'weber-state', 'Wildcats', 'Big Sky', NULL, 'FCS', '#492365', '#FFFFFF', NULL, 'Stewart Stadium', 'Ogden', 'UT', false);

-- =============================================================================
-- FCS: Big South-OVC - 9 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Central Arkansas Bears', 'Central Arkansas', 'UCA', 'central-arkansas', 'Bears', 'Big South-OVC', NULL, 'FCS', '#4F2D7F', '#A7A9AC', NULL, 'Estes Stadium', 'Conway', 'AR', false),
('Eastern Illinois Panthers', 'Eastern Illinois', 'EIU', 'eastern-illinois', 'Panthers', 'Big South-OVC', NULL, 'FCS', '#004B83', '#000000', NULL, 'O''Brien Field', 'Charleston', 'IL', false),
('Eastern Kentucky Colonels', 'Eastern Kentucky', 'EKU', 'eastern-kentucky', 'Colonels', 'Big South-OVC', NULL, 'FCS', '#611132', '#FFFFFF', NULL, 'Roy Kidd Stadium', 'Richmond', 'KY', false),
('Lindenwood Lions', 'Lindenwood', 'LNWD', 'lindenwood', 'Lions', 'Big South-OVC', NULL, 'FCS', '#000000', '#B59A57', NULL, 'Hunter Stadium', 'St. Charles', 'MO', false),
('SE Missouri Redhawks', 'SE Missouri', 'SEMO', 'se-missouri', 'Redhawks', 'Big South-OVC', NULL, 'FCS', '#C8102E', '#000000', NULL, 'Houck Stadium', 'Cape Girardeau', 'MO', false),
('Tennessee State Tigers', 'Tennessee State', 'TNST', 'tennessee-state', 'Tigers', 'Big South-OVC', NULL, 'FCS', '#00539B', '#FFFFFF', NULL, 'Nissan Stadium', 'Nashville', 'TN', false),
('Tennessee Tech Golden Eagles', 'Tennessee Tech', 'TNTH', 'tennessee-tech', 'Golden Eagles', 'Big South-OVC', NULL, 'FCS', '#4F2984', '#FFD100', NULL, 'Tucker Stadium', 'Cookeville', 'TN', false),
('UT Martin Skyhawks', 'UT Martin', 'UTM', 'ut-martin', 'Skyhawks', 'Big South-OVC', NULL, 'FCS', '#FF6B00', '#002D6C', NULL, 'Hardy Graham Stadium', 'Martin', 'TN', false),
('Western Illinois Leathernecks', 'Western Illinois', 'WIU', 'western-illinois', 'Leathernecks', 'Big South-OVC', NULL, 'FCS', '#663399', '#FFC72C', NULL, 'Hanson Field', 'Macomb', 'IL', false);

-- =============================================================================
-- FCS: CAA (Coastal Athletic Association) - 14 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('UAlbany Great Danes', 'UAlbany', 'UALB', 'ualbany', 'Great Danes', 'CAA', NULL, 'FCS', '#461660', '#EAAA00', NULL, 'Tom & Mary Casey Stadium', 'Albany', 'NY', false),
('Bryant Bulldogs', 'Bryant', 'BRY', 'bryant', 'Bulldogs', 'CAA', NULL, 'FCS', '#000000', '#C5960C', NULL, 'Bulldog Stadium', 'Smithfield', 'RI', false),
('Campbell Fighting Camels', 'Campbell', 'CAMP', 'campbell', 'Fighting Camels', 'CAA', NULL, 'FCS', '#F47920', '#000000', NULL, 'Barker-Lane Stadium', 'Buies Creek', 'NC', false),
('Elon Phoenix', 'Elon', 'ELON', 'elon', 'Phoenix', 'CAA', NULL, 'FCS', '#73000A', '#B59A57', NULL, 'Rhodes Stadium', 'Elon', 'NC', false),
('Hampton Pirates', 'Hampton', 'HAMP', 'hampton', 'Pirates', 'CAA', NULL, 'FCS', '#0067AC', '#FFFFFF', NULL, 'Armstrong Stadium', 'Hampton', 'VA', false),
('Maine Black Bears', 'Maine', 'ME', 'maine', 'Black Bears', 'CAA', NULL, 'FCS', '#003263', '#B5D3E7', NULL, 'Alfond Stadium', 'Orono', 'ME', false),
('Monmouth Hawks', 'Monmouth', 'MNTH', 'monmouth', 'Hawks', 'CAA', NULL, 'FCS', '#041A3B', '#FFFFFF', NULL, 'Kessler Stadium', 'West Long Branch', 'NJ', false),
('New Hampshire Wildcats', 'New Hampshire', 'UNH', 'new-hampshire', 'Wildcats', 'CAA', NULL, 'FCS', '#003DA5', '#FFFFFF', NULL, 'Wildcat Stadium', 'Durham', 'NH', false),
('NC A&T Aggies', 'NC A&T', 'NCAT', 'nc-at', 'Aggies', 'CAA', NULL, 'FCS', '#004684', '#F0AB00', NULL, 'BB&T Stadium', 'Greensboro', 'NC', false),
('Rhode Island Rams', 'Rhode Island', 'URI', 'rhode-island', 'Rams', 'CAA', NULL, 'FCS', '#002147', '#75B2DD', NULL, 'Meade Stadium', 'Kingston', 'RI', false),
('Stony Brook Seawolves', 'Stony Brook', 'STBK', 'stony-brook', 'Seawolves', 'CAA', NULL, 'FCS', '#990000', '#A0A0A0', NULL, 'Kenneth P. LaValle Stadium', 'Stony Brook', 'NY', false),
('Towson Tigers', 'Towson', 'TOW', 'towson', 'Tigers', 'CAA', NULL, 'FCS', '#FFB81C', '#000000', NULL, 'Johnny Unitas Stadium', 'Towson', 'MD', false),
('Villanova Wildcats', 'Villanova', 'VILL', 'villanova', 'Wildcats', 'CAA', NULL, 'FCS', '#00205B', '#13B5EA', NULL, 'Villanova Stadium', 'Villanova', 'PA', false),
('William & Mary Tribe', 'William & Mary', 'WM', 'william-mary', 'Tribe', 'CAA', NULL, 'FCS', '#115740', '#B9975B', NULL, 'Zable Stadium', 'Williamsburg', 'VA', false);

-- =============================================================================
-- FCS: Ivy League - 8 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Brown Bears', 'Brown', 'BRWN', 'brown', 'Bears', 'Ivy League', NULL, 'FCS', '#4E3629', '#C00404', NULL, 'Brown Stadium', 'Providence', 'RI', false),
('Columbia Lions', 'Columbia', 'CLMB', 'columbia', 'Lions', 'Ivy League', NULL, 'FCS', '#003865', '#9BCBEB', NULL, 'Wien Stadium at Baker Athletics Complex', 'New York', 'NY', false),
('Cornell Big Red', 'Cornell', 'COR', 'cornell', 'Big Red', 'Ivy League', NULL, 'FCS', '#B31B1B', '#FFFFFF', NULL, 'Schoellkopf Field', 'Ithaca', 'NY', false),
('Dartmouth Big Green', 'Dartmouth', 'DART', 'dartmouth', 'Big Green', 'Ivy League', NULL, 'FCS', '#00693E', '#FFFFFF', NULL, 'Memorial Field', 'Hanover', 'NH', false),
('Harvard Crimson', 'Harvard', 'HARV', 'harvard', 'Crimson', 'Ivy League', NULL, 'FCS', '#A51C30', '#000000', NULL, 'Harvard Stadium', 'Boston', 'MA', false),
('Penn Quakers', 'Penn', 'PENN', 'penn', 'Quakers', 'Ivy League', NULL, 'FCS', '#990000', '#011F5B', NULL, 'Franklin Field', 'Philadelphia', 'PA', false),
('Princeton Tigers', 'Princeton', 'PRIN', 'princeton', 'Tigers', 'Ivy League', NULL, 'FCS', '#FF671F', '#000000', NULL, 'Powers Field at Princeton Stadium', 'Princeton', 'NJ', false),
('Yale Bulldogs', 'Yale', 'YALE', 'yale', 'Bulldogs', 'Ivy League', NULL, 'FCS', '#00356B', '#FFFFFF', NULL, 'Yale Bowl', 'New Haven', 'CT', false);

-- =============================================================================
-- FCS: MEAC (Mid-Eastern Athletic Conference) - 6 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Delaware State Hornets', 'Delaware State', 'DSU', 'delaware-state', 'Hornets', 'MEAC', NULL, 'FCS', '#EE3124', '#009DDC', NULL, 'Alumni Stadium', 'Dover', 'DE', false),
('Howard Bison', 'Howard', 'HOW', 'howard', 'Bison', 'MEAC', NULL, 'FCS', '#003A63', '#E51937', NULL, 'William H. Greene Stadium', 'Washington', 'DC', false),
('Morgan State Bears', 'Morgan State', 'MORG', 'morgan-state', 'Bears', 'MEAC', NULL, 'FCS', '#1B4383', '#F47937', NULL, 'Hughes Memorial Stadium', 'Baltimore', 'MD', false),
('Norfolk State Spartans', 'Norfolk State', 'NFKST', 'norfolk-state', 'Spartans', 'MEAC', NULL, 'FCS', '#007A53', '#F3D03E', NULL, 'Dick Price Stadium', 'Norfolk', 'VA', false),
('NC Central Eagles', 'NC Central', 'NCCU', 'nc-central', 'Eagles', 'MEAC', NULL, 'FCS', '#862633', '#9E8E5C', NULL, 'O''Kelly-Riddick Stadium', 'Durham', 'NC', false),
('SC State Bulldogs', 'SC State', 'SCST', 'sc-state', 'Bulldogs', 'MEAC', NULL, 'FCS', '#862633', '#001A72', NULL, 'Oliver C. Dawson Stadium', 'Orangeburg', 'SC', false);

-- =============================================================================
-- FCS: MVFC (Missouri Valley Football Conference) - 10 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Illinois State Redbirds', 'Illinois State', 'ILST', 'illinois-state', 'Redbirds', 'MVFC', NULL, 'FCS', '#CE1126', '#F9DD16', NULL, 'Hancock Stadium', 'Normal', 'IL', false),
('Indiana State Sycamores', 'Indiana State', 'INST', 'indiana-state', 'Sycamores', 'MVFC', NULL, 'FCS', '#00669A', '#FFFFFF', NULL, 'Memorial Stadium', 'Terre Haute', 'IN', false),
('Murray State Racers', 'Murray State', 'MURR', 'murray-state', 'Racers', 'MVFC', NULL, 'FCS', '#002144', '#FFC72C', NULL, 'Roy Stewart Stadium', 'Murray', 'KY', false),
('North Dakota Fighting Hawks', 'North Dakota', 'UND', 'north-dakota', 'Fighting Hawks', 'MVFC', NULL, 'FCS', '#009A44', '#000000', NULL, 'Alerus Center', 'Grand Forks', 'ND', false),
('North Dakota State Bison', 'North Dakota State', 'NDSU', 'north-dakota-state', 'Bison', 'MVFC', NULL, 'FCS', '#0A5640', '#FFC72A', NULL, 'Gate City Bank Field at the Fargodome', 'Fargo', 'ND', false),
('South Dakota Coyotes', 'South Dakota', 'SDAK', 'south-dakota', 'Coyotes', 'MVFC', NULL, 'FCS', '#CD1241', '#000000', NULL, 'DakotaDome', 'Vermillion', 'SD', false),
('South Dakota State Jackrabbits', 'South Dakota State', 'SDST', 'south-dakota-state', 'Jackrabbits', 'MVFC', NULL, 'FCS', '#0033A0', '#FFD100', NULL, 'Dana J. Dykhouse Stadium', 'Brookings', 'SD', false),
('Southern Illinois Salukis', 'Southern Illinois', 'SIU', 'southern-illinois', 'Salukis', 'MVFC', NULL, 'FCS', '#720000', '#000000', NULL, 'Saluki Stadium', 'Carbondale', 'IL', false),
('Youngstown State Penguins', 'Youngstown State', 'YSU', 'youngstown-state', 'Penguins', 'MVFC', NULL, 'FCS', '#C8102E', '#000000', NULL, 'Stambaugh Stadium', 'Youngstown', 'OH', false),
('Northern Iowa Panthers', 'Northern Iowa', 'UNI', 'northern-iowa', 'Panthers', 'MVFC', NULL, 'FCS', '#4B116F', '#FFC72C', NULL, 'UNI-Dome', 'Cedar Falls', 'IA', false);

-- =============================================================================
-- FCS: NEC (Northeast Conference) - 9 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Central Connecticut Blue Devils', 'Central Connecticut', 'CCSU', 'central-connecticut', 'Blue Devils', 'NEC', NULL, 'FCS', '#00539B', '#FFFFFF', NULL, 'Arute Field', 'New Britain', 'CT', false),
('Duquesne Dukes', 'Duquesne', 'DUQ', 'duquesne', 'Dukes', 'NEC', NULL, 'FCS', '#041E42', '#BA0C2F', NULL, 'Rooney Field', 'Pittsburgh', 'PA', false),
('LIU Sharks', 'LIU', 'LIU', 'liu', 'Sharks', 'NEC', NULL, 'FCS', '#69B3E7', '#FFC72C', NULL, 'Bethpage Federal Credit Union Stadium', 'Brookville', 'NY', false),
('Mercyhurst Lakers', 'Mercyhurst', 'MERH', 'mercyhurst', 'Lakers', 'NEC', NULL, 'FCS', '#07594D', '#182752', NULL, 'Saxon Stadium', 'Erie', 'PA', false),
('Sacred Heart Pioneers', 'Sacred Heart', 'SHU', 'sacred-heart', 'Pioneers', 'NEC', NULL, 'FCS', '#CE1141', '#A7A8AA', NULL, 'Campus Field', 'Fairfield', 'CT', false),
('St. Francis Red Flash', 'St. Francis', 'SFU', 'st-francis', 'Red Flash', 'NEC', NULL, 'FCS', '#CC0000', '#FFFFFF', NULL, 'DeGol Field', 'Loretto', 'PA', false),
('Stonehill Skyhawks', 'Stonehill', 'STON', 'stonehill', 'Skyhawks', 'NEC', NULL, 'FCS', '#461D7C', '#FFFFFF', NULL, 'W.B. Mason Stadium', 'Easton', 'MA', false),
('Wagner Seahawks', 'Wagner', 'WAG', 'wagner', 'Seahawks', 'NEC', NULL, 'FCS', '#006747', '#FFFFFF', NULL, 'Wagner College Stadium', 'Staten Island', 'NY', false),
('Robert Morris Colonials', 'Robert Morris', 'RMU', 'robert-morris', 'Colonials', 'NEC', NULL, 'FCS', '#14234B', '#C8102E', NULL, 'Joe Walton Stadium', 'Moon Township', 'PA', false);

-- =============================================================================
-- FCS: Patriot League - 7 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Bucknell Bison', 'Bucknell', 'BUCK', 'bucknell', 'Bison', 'Patriot League', NULL, 'FCS', '#E87722', '#003865', NULL, 'Christy Mathewson-Memorial Stadium', 'Lewisburg', 'PA', false),
('Colgate Raiders', 'Colgate', 'COLG', 'colgate', 'Raiders', 'Patriot League', NULL, 'FCS', '#821019', '#FFFFFF', NULL, 'Andy Kerr Stadium', 'Hamilton', 'NY', false),
('Fordham Rams', 'Fordham', 'FOR', 'fordham', 'Rams', 'Patriot League', NULL, 'FCS', '#780028', '#FFFFFF', NULL, 'Jack Coffey Field', 'Bronx', 'NY', false),
('Georgetown Hoyas', 'Georgetown', 'GTWN', 'georgetown', 'Hoyas', 'Patriot League', NULL, 'FCS', '#041E42', '#A7A8AA', NULL, 'Cooper Field', 'Washington', 'DC', false),
('Holy Cross Crusaders', 'Holy Cross', 'HC', 'holy-cross', 'Crusaders', 'Patriot League', NULL, 'FCS', '#602D89', '#FFFFFF', NULL, 'Fitton Field', 'Worcester', 'MA', false),
('Lafayette Leopards', 'Lafayette', 'LAF', 'lafayette', 'Leopards', 'Patriot League', NULL, 'FCS', '#98002E', '#FFFFFF', NULL, 'Fisher Stadium', 'Easton', 'PA', false),
('Lehigh Mountain Hawks', 'Lehigh', 'LEH', 'lehigh', 'Mountain Hawks', 'Patriot League', NULL, 'FCS', '#653600', '#FFFFFF', NULL, 'Goodman Stadium', 'Bethlehem', 'PA', false);

-- =============================================================================
-- FCS: Pioneer Football League - 10 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Butler Bulldogs', 'Butler', 'BUTL', 'butler', 'Bulldogs', 'Pioneer', NULL, 'FCS', '#13294B', '#FF6600', NULL, 'Bud and Jackie Sellick Bowl', 'Indianapolis', 'IN', false),
('Davidson Wildcats', 'Davidson', 'DAV', 'davidson', 'Wildcats', 'Pioneer', NULL, 'FCS', '#CC0000', '#000000', NULL, 'Davidson College Stadium', 'Davidson', 'NC', false),
('Dayton Flyers', 'Dayton', 'DAY', 'dayton', 'Flyers', 'Pioneer', NULL, 'FCS', '#CE1141', '#004B8D', NULL, 'Welcome Stadium', 'Dayton', 'OH', false),
('Drake Bulldogs', 'Drake', 'DRKE', 'drake', 'Bulldogs', 'Pioneer', NULL, 'FCS', '#004477', '#FFFFFF', NULL, 'Drake Stadium', 'Des Moines', 'IA', false),
('Marist Red Foxes', 'Marist', 'MRST', 'marist', 'Red Foxes', 'Pioneer', NULL, 'FCS', '#C8102E', '#FFFFFF', NULL, 'Tenney Stadium', 'Poughkeepsie', 'NY', false),
('Morehead State Eagles', 'Morehead State', 'MORHD', 'morehead-state', 'Eagles', 'Pioneer', NULL, 'FCS', '#005EB8', '#FFC72C', NULL, 'Phil Simms Stadium', 'Morehead', 'KY', false),
('Presbyterian Blue Hose', 'Presbyterian', 'PRES', 'presbyterian', 'Blue Hose', 'Pioneer', NULL, 'FCS', '#003087', '#FFFFFF', NULL, 'Bailey Memorial Stadium', 'Clinton', 'SC', false),
('San Diego Toreros', 'San Diego', 'SAND', 'san-diego', 'Toreros', 'Pioneer', NULL, 'FCS', '#002855', '#A7C5EB', NULL, 'Torero Stadium', 'San Diego', 'CA', false),
('Stetson Hatters', 'Stetson', 'STET', 'stetson', 'Hatters', 'Pioneer', NULL, 'FCS', '#006747', '#FFFFFF', NULL, 'Spec Martin Stadium', 'DeLand', 'FL', false),
('Valparaiso Beacons', 'Valparaiso', 'VALP', 'valparaiso', 'Beacons', 'Pioneer', NULL, 'FCS', '#613318', '#FFC72C', NULL, 'Brown Field', 'Valparaiso', 'IN', false);

-- =============================================================================
-- FCS: SoCon (Southern Conference) - 9 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Chattanooga Mocs', 'Chattanooga', 'CHAT', 'chattanooga', 'Mocs', 'SoCon', NULL, 'FCS', '#00386B', '#EEB310', NULL, 'Finley Stadium', 'Chattanooga', 'TN', false),
('ETSU Buccaneers', 'ETSU', 'ETSU', 'etsu', 'Buccaneers', 'SoCon', NULL, 'FCS', '#041E42', '#FFC72C', NULL, 'William B. Greene Jr. Stadium', 'Johnson City', 'TN', false),
('Furman Paladins', 'Furman', 'FUR', 'furman', 'Paladins', 'SoCon', NULL, 'FCS', '#582C83', '#FFFFFF', NULL, 'Paladin Stadium', 'Greenville', 'SC', false),
('Mercer Bears', 'Mercer', 'MERC', 'mercer', 'Bears', 'SoCon', NULL, 'FCS', '#F76800', '#000000', NULL, 'Five Star Stadium', 'Macon', 'GA', false),
('Samford Bulldogs', 'Samford', 'SAM', 'samford', 'Bulldogs', 'SoCon', NULL, 'FCS', '#002649', '#C4161D', NULL, 'Seibert Stadium', 'Homewood', 'AL', false),
('The Citadel Bulldogs', 'The Citadel', 'CIT', 'the-citadel', 'Bulldogs', 'SoCon', NULL, 'FCS', '#3975B7', '#FFFFFF', NULL, 'Johnson Hagood Stadium', 'Charleston', 'SC', false),
('VMI Keydets', 'VMI', 'VMI', 'vmi', 'Keydets', 'SoCon', NULL, 'FCS', '#A71F23', '#FFD520', NULL, 'Alumni Memorial Field', 'Lexington', 'VA', false),
('Western Carolina Catamounts', 'Western Carolina', 'WCU', 'western-carolina', 'Catamounts', 'SoCon', NULL, 'FCS', '#592C88', '#C1A875', NULL, 'Bob Waters Field at E.J. Whitmire Stadium', 'Cullowhee', 'NC', false),
('Wofford Terriers', 'Wofford', 'WOF', 'wofford', 'Terriers', 'SoCon', NULL, 'FCS', '#886E4C', '#000000', NULL, 'Gibbs Stadium', 'Spartanburg', 'SC', false);

-- =============================================================================
-- FCS: Southland Conference - 9 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Houston Christian Huskies', 'Houston Christian', 'HCU', 'houston-christian', 'Huskies', 'Southland', NULL, 'FCS', '#00529B', '#F0AB00', NULL, 'Husky Stadium', 'Houston', 'TX', false),
('Incarnate Word Cardinals', 'Incarnate Word', 'UIW', 'incarnate-word', 'Cardinals', 'Southland', NULL, 'FCS', '#CB333B', '#000000', NULL, 'Gayle and Tom Benson Stadium', 'San Antonio', 'TX', false),
('Lamar Cardinals', 'Lamar', 'LAM', 'lamar', 'Cardinals', 'Southland', NULL, 'FCS', '#DC0032', '#FFFFFF', NULL, 'Provost Umphrey Stadium', 'Beaumont', 'TX', false),
('McNeese Cowboys', 'McNeese', 'MCN', 'mcneese', 'Cowboys', 'Southland', NULL, 'FCS', '#005CB9', '#FFC72C', NULL, 'Cowboy Stadium', 'Lake Charles', 'LA', false),
('Nicholls Colonels', 'Nicholls', 'NICH', 'nicholls', 'Colonels', 'Southland', NULL, 'FCS', '#C8102E', '#A7A8AA', NULL, 'John L. Guidry Stadium', 'Thibodaux', 'LA', false),
('Northwestern State Demons', 'Northwestern State', 'NWST', 'northwestern-state', 'Demons', 'Southland', NULL, 'FCS', '#4F2D7F', '#FF6B00', NULL, 'Turpin Stadium', 'Natchitoches', 'LA', false),
('SE Louisiana Lions', 'SE Louisiana', 'SELA', 'se-louisiana', 'Lions', 'Southland', NULL, 'FCS', '#006747', '#FFC72C', NULL, 'Strawberry Stadium', 'Hammond', 'LA', false),
('SFA Lumberjacks', 'SFA', 'SFA', 'sfa', 'Lumberjacks', 'Southland', NULL, 'FCS', '#3E2680', '#FFFFFF', NULL, 'Homer Bryce Stadium', 'Nacogdoches', 'TX', false),
('Texas A&M-Commerce Lions', 'Texas A&M-Commerce', 'TAMC', 'texas-am-commerce', 'Lions', 'Southland', NULL, 'FCS', '#002D6C', '#FFC72C', NULL, 'Memorial Stadium', 'Commerce', 'TX', false);

-- =============================================================================
-- FCS: SWAC (Southwestern Athletic Conference) - 12 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Alabama A&M Bulldogs', 'Alabama A&M', 'AAMU', 'alabama-am', 'Bulldogs', 'SWAC', NULL, 'FCS', '#660000', '#FFFFFF', NULL, 'Louis Crews Stadium', 'Huntsville', 'AL', false),
('Alabama State Hornets', 'Alabama State', 'ALST', 'alabama-state', 'Hornets', 'SWAC', NULL, 'FCS', '#000000', '#C99700', NULL, 'Hornet Stadium', 'Montgomery', 'AL', false),
('Alcorn State Braves', 'Alcorn State', 'ALCN', 'alcorn-state', 'Braves', 'SWAC', NULL, 'FCS', '#4F2984', '#FFC72C', NULL, 'Spinks-Casem Stadium', 'Lorman', 'MS', false),
('Arkansas-Pine Bluff Golden Lions', 'Arkansas-Pine Bluff', 'UAPB', 'arkansas-pine-bluff', 'Golden Lions', 'SWAC', NULL, 'FCS', '#000000', '#FFC72C', NULL, 'Simmons Bank Field', 'Pine Bluff', 'AR', false),
('Bethune-Cookman Wildcats', 'Bethune-Cookman', 'BCU', 'bethune-cookman', 'Wildcats', 'SWAC', NULL, 'FCS', '#660000', '#FFCC00', NULL, 'Daytona Stadium', 'Daytona Beach', 'FL', false),
('Florida A&M Rattlers', 'Florida A&M', 'FAMU', 'florida-am', 'Rattlers', 'SWAC', NULL, 'FCS', '#006633', '#FF6600', NULL, 'Bragg Memorial Stadium', 'Tallahassee', 'FL', false),
('Grambling State Tigers', 'Grambling State', 'GRAM', 'grambling-state', 'Tigers', 'SWAC', NULL, 'FCS', '#000000', '#EAA921', NULL, 'Eddie Robinson Stadium', 'Grambling', 'LA', false),
('Jackson State Tigers', 'Jackson State', 'JKST', 'jackson-state', 'Tigers', 'SWAC', NULL, 'FCS', '#002147', '#FFFFFF', NULL, 'Mississippi Veterans Memorial Stadium', 'Jackson', 'MS', false),
('Mississippi Valley State Delta Devils', 'Mississippi Valley State', 'MVSU', 'mississippi-valley-state', 'Delta Devils', 'SWAC', NULL, 'FCS', '#006338', '#FFFFFF', NULL, 'Rice-Totten Stadium', 'Itta Bena', 'MS', false),
('Prairie View A&M Panthers', 'Prairie View A&M', 'PVAM', 'prairie-view-am', 'Panthers', 'SWAC', NULL, 'FCS', '#4F2D7F', '#FFC72C', NULL, 'Panther Stadium', 'Prairie View', 'TX', false),
('Southern Jaguars', 'Southern', 'SOU', 'southern', 'Jaguars', 'SWAC', NULL, 'FCS', '#005DAA', '#FFC72C', NULL, 'A.W. Mumford Stadium', 'Baton Rouge', 'LA', false),
('Texas Southern Tigers', 'Texas Southern', 'TXSO', 'texas-southern', 'Tigers', 'SWAC', NULL, 'FCS', '#6D2C3F', '#FFFFFF', NULL, 'Shell Energy Stadium', 'Houston', 'TX', false);

-- =============================================================================
-- FCS: UAC (United Athletic Conference) - 9 teams
-- =============================================================================

INSERT INTO schools (name, short_name, abbreviation, slug, mascot, conference, division, classification, primary_color, secondary_color, logo_url, stadium, city, state, is_fbs) VALUES
('Abilene Christian Wildcats', 'Abilene Christian', 'ACU', 'abilene-christian', 'Wildcats', 'UAC', NULL, 'FCS', '#4F2D7F', '#FFFFFF', NULL, 'Wildcat Stadium', 'Abilene', 'TX', false),
('Austin Peay Governors', 'Austin Peay', 'APSU', 'austin-peay', 'Governors', 'UAC', NULL, 'FCS', '#C8102E', '#000000', NULL, 'Fortera Stadium', 'Clarksville', 'TN', false),
('Bellarmine Knights', 'Bellarmine', 'BELL', 'bellarmine', 'Knights', 'UAC', NULL, 'FCS', '#C8102E', '#231F20', NULL, 'Owsley B. Frazier Stadium', 'Louisville', 'KY', false),
('North Alabama Lions', 'North Alabama', 'UNA', 'north-alabama', 'Lions', 'UAC', NULL, 'FCS', '#4F2D7F', '#FFC72C', NULL, 'Braly Stadium', 'Florence', 'AL', false),
('Queens Royals', 'Queens', 'QNSU', 'queens', 'Royals', 'UAC', NULL, 'FCS', '#003DA5', '#A7A8AA', NULL, 'Irwin Belk Stadium', 'Charlotte', 'NC', false),
('Southern Utah Thunderbirds', 'Southern Utah', 'SUU', 'southern-utah', 'Thunderbirds', 'UAC', NULL, 'FCS', '#CC0000', '#002147', NULL, 'Eccles Coliseum', 'Cedar City', 'UT', false),
('Tarleton State Texans', 'Tarleton State', 'TARL', 'tarleton-state', 'Texans', 'UAC', NULL, 'FCS', '#4F2D7F', '#FFFFFF', NULL, 'Memorial Stadium', 'Stephenville', 'TX', false),
('Utah Tech Trailblazers', 'Utah Tech', 'UTCH', 'utah-tech', 'Trailblazers', 'UAC', NULL, 'FCS', '#BA1C21', '#002147', NULL, 'Greater Zion Stadium', 'St. George', 'UT', false),
('West Georgia Wolves', 'West Georgia', 'UWG', 'west-georgia', 'Wolves', 'UAC', NULL, 'FCS', '#002147', '#C8102E', NULL, 'University Stadium', 'Carrollton', 'GA', false);
