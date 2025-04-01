const mongoose = require('mongoose');
const Station = require('./models/Station'); // Adjust the path as needed

mongoose.connect('mongodb://localhost:27017/smg-electric', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.error("MongoDB connection error:", err));

const stations = [{
    "latitude": "15.5104722",
    "longitude": "73.8372222",
    "name": "EESL Legislative Assembly Goa"
  },
  {
    "latitude": "28.547217",
    "longitude": "77.244324",
    "name": "EESL R block GK1"
  },
  {
    "latitude": "28.546273",
    "longitude": "77.19711",
    "name": "EESL SDA market"
  },
  {
    "latitude": "28.608947",
    "longitude": "77.362725",
    "name": "EESL Tata Advance Systems Noida"
  },
  {
    "latitude": "28.5587496",
    "longitude": "77.0909566",
    "name": "EESL Feroze Gandhi Road Lajpat Nagar"
  },
  {
    "latitude": "28.5580077",
    "longitude": "77.1588093",
    "name": "EESL PVR Priya Delhi"
  },
  {
    "latitude": "28.6026531",
    "longitude": "77.1666318",
    "name": "EESL Meharchand Double Storey Market"
  },
  {
    "latitude": "8.481159",
    "longitude": "76.912456",
    "name": "ANERT-EESL Sangamukham Kerala"
  },
  {
    "latitude": "8.4927752",
    "longitude": "76.9572956",
    "name": "ANERT-EESL Thycaud Kerala"
  },
  {
    "latitude": "28.5584839",
    "longitude": "77.0909568",
    "name": "EESL Veer Savarkar Marg, Lajpat Nagar"
  },
  {
    "latitude": "30.695929",
    "longitude": "76.834874",
    "name": "HAREDA EESL Panchkula"
  },
  {
    "latitude": "30.695929",
    "longitude": "76.834874",
    "name": "HAREDA EESL Panchkula"
  },
  {
    "latitude": "22.594",
    "longitude": "88.4729",
    "name": " EESL ECO Park Gate No 1 New Town"
  },
  {
    "latitude": "22.594",
    "longitude": "88.4729",
    "name": " EESL ECO Park Gate No 1 New Town"
  },
  {
    "latitude": "22.5791553",
    "longitude": "88.4687647",
    "name": " EESL Biswa Bangla Gate Rotary"
  },
  {
    "latitude": "13.088249",
    "longitude": "80.285359",
    "name": "EESL Shapoorji Bus Terminus Newtown"
  },
  {
    "latitude": "13.088249",
    "longitude": "80.285359",
    "name": "EESL Adhoc New Central, HPCL, New Town"
  },
  {
    "latitude": "13.079097",
    "longitude": "80.261538",
    "name": "EESL Shapoorji Bus Terminus Newtown"
  },
  {
    "latitude": "13.079097",
    "longitude": "80.261538",
    "name": "EESL Chennai Egmore metro"
  },
  {
    "latitude": "13.0237",
    "longitude": "80.2282",
    "name": "EESL Saidapet Metro station"
  },
  {
    "latitude": "13.0237",
    "longitude": "80.2282",
    "name": "EESL Saidapet Metro station"
  },
  {
    "latitude": "13.0237",
    "longitude": "80.2282",
    "name": "EESL Saidapet Metro station"
  },
  {
    "latitude": "13.0853",
    "longitude": "80.2016",
    "name": "EESL Tirumangalam Metro station"
  },
  {
    "latitude": "13.0853",
    "longitude": "80.2016",
    "name": "EESL Thirumangalam Metro"
  },
  {
    "latitude": "13.0853",
    "longitude": "80.2016",
    "name": "EESL Tirumangalam Metro station"
  },
  {
    "latitude": "28.556608",
    "longitude": "77.232732",
    "name": "EESL Alandur metro"
  },
  {
    "latitude": "9.977164",
    "longitude": "76.27777",
    "name": "EESL Chennai Egmore metro"
  },
  {
    "latitude": "22.5695",
    "longitude": "88.5169",
    "name": "EESL Shapoorji Bus Terminus Newtown"
  },
  {
    "latitude": "28.582421",
    "longitude": "77.3635947",
    "name": "EESL Adhoc New Central, HPCL, New Town"
  },
  {
    "latitude": "28.577319",
    "longitude": "77.3587651",
    "name": "EESL Shapoorji Bus Terminus Newtown"
  },
  {
    "latitude": "9.63628",
    "longitude": "76.3352",
    "name": "EESL Koyambedu"
  },
  {
    "latitude": "28.5842756",
    "longitude": "77.3137535",
    "name": "EESL Anna Nagar East Station"
  },
  {
    "latitude": "22.617907",
    "longitude": "88.466368",
    "name": "EESL Adhoc New Central, HPCL, New Town"
  },
  {
    "latitude": "21.163948",
    "longitude": "81.788547",
    "name": "EESL Prayas Bhawan Nava Raipur"
  },
  {
    "latitude": "21.161505",
    "longitude": "81.796858",
    "name": "EESL Mantraly Naya Raipur"
  },
  {
    "latitude": "28.5726478",
    "longitude": "77.3408251",
    "name": "EESL Prayas Bhawan Nava Raipur"
  },
  {
    "latitude": "28.5726478",
    "longitude": "77.3408251",
    "name": "EESL Mantraly Naya Raipur"
  },
  {
    "latitude": "22.5695",
    "longitude": "88.5169",
    "name": "EESL Shapoorji Bus Terminus Newtown"
  },
  {
    "latitude": "28.5670208",
    "longitude": "77.3353024",
    "name": "EESL Shenoy Nagar Metro"
  },
  {
    "latitude": "28.5670208",
    "longitude": "77.3353024",
    "name": "EESL Pachaiyappa"
  },
  {
    "latitude": "28.6057471",
    "longitude": "77.3573349",
    "name": "EESL Pachaiyappa"
  },
  {
    "latitude": "28.5726478",
    "longitude": "77.3408251",
    "name": "EESL Kirti Mann Plaza Noida"
  },
  {
    "latitude": "28.5000204",
    "longitude": "77.4108813",
    "name": "EESL Adwant Chowk Noida"
  },
  {
    "latitude": "28.5826069",
    "longitude": "77.3128436",
    "name": "EESL Alka Cinema Noida"
  },
  {
    "latitude": "28.5880051",
    "longitude": "77.3520796",
    "name": "EESL RTO Office Noida"
  },
  {
    "latitude": "13.003498",
    "longitude": "80.201548",
    "name": "EESL Alandur metro"
  },
  {
    "latitude": "28.5670208",
    "longitude": "77.3353024",
    "name": "EESL Ganga Shopping Complex Noida"
  },
  {
    "latitude": "28.5447044",
    "longitude": "77.3272594",
    "name": "EESL SPCI Noida"
  },
  {
    "latitude": "13.079097",
    "longitude": "80.261538",
    "name": "EESL Chennai Egmore metro"
  },
  {
    "latitude": "28.547217",
    "longitude": "77.244324",
    "name": "EESL R block GK1"
  },
  {
    "latitude": "28.546273",
    "longitude": "77.19711",
    "name": "EESL SDA market"
  },
  {
    "latitude": "28.558938",
    "longitude": "77.19631",
    "name": "EESL Safderjung Enclave"
  },
  {
    "latitude": "22.5785885",
    "longitude": "88.4508228",
    "name": "EESL New Town"
  },
  {
    "latitude": "22.5785885",
    "longitude": "88.4508228",
    "name": "EESL New Town"
  },
  {
    "latitude": "22.5852479",
    "longitude": "88.4547116",
    "name": "EESL Business Club New Town "
  },
  {
    "latitude": "22.5852479",
    "longitude": "88.4547116",
    "name": "EESL Business Club New Town "
  },
  {
    "latitude": "22.611245",
    "longitude": "88.466586",
    "name": "EESL Gate no 4 Eco Park New Town"
  },
  {
    "latitude": "22.611245",
    "longitude": "88.466586",
    "name": "EESL Gate no 4 Eco Park New Town"
  },
  {
    "latitude": "22.607778",
    "longitude": "88.463918",
    "name": "EESL Gate No 6 Eco Park New Town "
  },
  {
    "latitude": "22.607778",
    "longitude": "88.463918",
    "name": "EESL Gate No 6 Eco Park New Town "
  },
  {
    "latitude": "22.577346",
    "longitude": "88.478575",
    "name": "EESL Tata Memorial Cancer Hospital "
  },
  {
    "latitude": "22.577346",
    "longitude": "88.478575",
    "name": "EESL Tata Memorial Cancer Hospital "
  },
  {
    "latitude": "22.579022",
    "longitude": "88.460325",
    "name": "EESL Axis Mall "
  },
  {
    "latitude": "22.579022",
    "longitude": "88.460325",
    "name": "EESL Axis Mall "
  },
  {
    "latitude": "28.552074",
    "longitude": "77.203279",
    "name": "EESL Aurbindo Market place"
  },
  {
    "latitude": "28.5704287",
    "longitude": "77.3598121",
    "name": "EESL Sector 50 Market"
  },
  {
    "latitude": "28.5704287",
    "longitude": "77.3598121",
    "name": "EESL Sector 50 Market"
  },
  {
    "latitude": "28.5704287",
    "longitude": "77.3598121",
    "name": "EESL Sector 50 Market"
  },
  {
    "latitude": "13.152457",
    "longitude": "77.568071",
    "name": "EESL Yelahanka Bengaluru"
  },
  {
    "latitude": "28.5958333",
    "longitude": "77.1805556",
    "name": " EESL Sushma Swaraj Bhawan"
  },
  {
    "latitude": "28.5580077",
    "longitude": "77.1588093",
    "name": "EESL PVR Priya Delhi"
  },
  {
    "latitude": "9.977164",
    "longitude": "76.27777",
    "name": "ANERT-EESL Ernakulam Kerala"
  },
  {
    "latitude": "8.481159",
    "longitude": "76.912456",
    "name": "ANERT-EESL Sangamukham Kerala"
  },
  {
    "latitude": "8.4927752",
    "longitude": "76.9572956",
    "name": "ANERT-EESL Thycaud Kerala"
  },
  {
    "latitude": "28.5971047",
    "longitude": "77.3627113",
    "name": "EESL Shopprix Mall Noida"
  },
  {
    "latitude": "28.531006",
    "longitude": "77.208693",
    "name": "EESL Malviya Nagar Delhi"
  },
  {
    "latitude": "28.531006",
    "longitude": "77.208693",
    "name": "EESL Malviya Nagar Delhi"
  },
  {
    "latitude": "13.088249",
    "longitude": "80.285359",
    "name": "EESL High court station"
  },
  {
    "latitude": "13.088249",
    "longitude": "80.285359",
    "name": "EESL High court station"
  },
  {
    "latitude": "13.074043",
    "longitude": "80.195354",
    "name": "EESL Koyambedu"
  },
  {
    "latitude": "13.074043",
    "longitude": "80.195354",
    "name": "EESL Koyambedu"
  },
  {
    "latitude": "13.084713",
    "longitude": "80.219897",
    "name": "EESL Anna Nagar East Station"
  },
  {
    "latitude": "13.084713",
    "longitude": "80.219897",
    "name": "EESL Anna Nagar East Station"
  },
  {
    "latitude": "28.626475",
    "longitude": "77.375142",
    "name": "EESL Electronic City Metro Station"
  },
  {
    "latitude": "28.628915",
    "longitude": "77.375303",
    "name": "EESL H-Block Market, Haldiram"
  },
  {
    "latitude": "13.031759",
    "longitude": "80.241923",
    "name": "Chennai Metro Nandanam Station"
  },
  {
    "latitude": "13.031759",
    "longitude": "80.241923",
    "name": "Chennai Metro Nandanam Station"
  },
  {
    "latitude": "21.0870127",
    "longitude": "79.0636227",
    "name": "EESL Nagpur"
  },
  {
    "latitude": "21.0870127",
    "longitude": "79.0636227",
    "name": "EESL Nagpur"
  },
  {
    "latitude": "28.578614",
    "longitude": "77.317483",
    "name": "EESL Sector 16 Near Metro Station Noida"
  },
  {
    "latitude": "21.163948",
    "longitude": "81.788547",
    "name": "EESL Prayas Bhawan Nava Raipur"
  },
  {
    "latitude": "21.161505",
    "longitude": "81.796858",
    "name": "EESL Mantraly Naya Raipur"
  },
  {
    "latitude": "15.5108",
    "longitude": "73.8368",
    "name": "EESL EDC Parking Goa"
  },
  {
    "latitude": "28.600735",
    "longitude": "77.226277",
    "name": "EESL Prithviraj Market"
  },
  {
    "latitude": "28.588117",
    "longitude": "77.217564",
    "name": "EESL Jor Bagh Market"
  },
  {
    "latitude": "28.580532",
    "longitude": "77.221048",
    "name": "EESL Khanna Market 1"
  },
  {
    "latitude": "28.584365",
    "longitude": "77.22054",
    "name": "EESL Khanna Market 2"
  },
  {
    "latitude": "28.601809",
    "longitude": "77.186432",
    "name": "EESL Malcha Marg Market"
  },
  {
    "latitude": "28.632973",
    "longitude": "77.222937",
    "name": "EESL M Block"
  },
  {
    "latitude": "28.630256",
    "longitude": "77.225668",
    "name": "EESL Barakhamba"
  },
  {
    "latitude": "28.632973",
    "longitude": "77.222937",
    "name": "EESL Block M, CP"
  },
  {
    "latitude": "28.631584",
    "longitude": "77.2219",
    "name": "EESL Oriental Bank"
  },
  {
    "latitude": "28.634422",
    "longitude": "77.220852",
    "name": "EESL Ferns n Petals"
  },
  {
    "latitude": "28.634388",
    "longitude": "77.221038",
    "name": "EESL Croma"
  },
  {
    "latitude": "28.63491",
    "longitude": "77.219522",
    "name": "EESL PVR Plaza"
  },
  {
    "latitude": "28.634371",
    "longitude": "77.2195",
    "name": "EESL Block B"
  },
  {
    "latitude": "28.631584",
    "longitude": "77.2219",
    "name": "EESL HP Petrol Pump"
  },
  {
    "latitude": "28.624419",
    "longitude": "77.213718",
    "name": "EESL Sansad Marg"
  },
  {
    "latitude": "28.633841",
    "longitude": "77.217664",
    "name": "EESL Iqbal Bros."
  },
  {
    "latitude": "28.621724",
    "longitude": "77.219286",
    "name": "EESL Bharat Sanchar Bhawan"
  },
  {
    "latitude": "28.626695",
    "longitude": "77.231943",
    "name": "EESL FICCI Chowk"
  },
  {
    "latitude": "28.617517",
    "longitude": "77.213919",
    "name": "EESL Press Club"
  },
  {
    "latitude": "28.63388",
    "longitude": "77.221078",
    "name": "EESL Snow White"
  },
  {
    "latitude": "28.634137",
    "longitude": "77.220382",
    "name": "EESL Van Heusen"
  },
  {
    "latitude": "28.633733",
    "longitude": "77.22353",
    "name": "EESL Shanker Market"
  },
  {
    "latitude": "28.622656",
    "longitude": "77.210994",
    "name": "EESL Akashwani Bhawan"
  },
  {
    "latitude": "28.6182604",
    "longitude": "77.2125699",
    "name": "EESL Chelmsford Club"
  },
  {
    "latitude": "28.585492",
    "longitude": "77.191634",
    "name": "EESL Yashwant Place"
  },
  {
    "latitude": "28.63388",
    "longitude": "77.221078",
    "name": "EESL IVORY Mart"
  },
  {
    "latitude": "28.585298",
    "longitude": "77.191008",
    "name": "EESL Yashwant Place Market"
  },
  {
    "latitude": "28.601809",
    "longitude": "77.186432",
    "name": "EESL Malcha Marg Market"
  },
  {
    "latitude": "28.577999",
    "longitude": "77.209521",
    "name": "EESL Laxmi Bai Market"
  },
  {
    "latitude": "28.63242",
    "longitude": "77.218068",
    "name": "EESL Block A"
  },
  {
    "latitude": "28.577259",
    "longitude": "77.19692",
    "name": "EESL Sarojini Nagar Market"
  },
  {
    "latitude": "28.631121",
    "longitude": "77.221654",
    "name": "EESL Gopal Das Building"
  },
  {
    "latitude": "28.633614",
    "longitude": "77.207691",
    "name": "EESL Jain Bhawan"
  },
  {
    "latitude": "28.599477",
    "longitude": "77.215583",
    "name": "EESL Hotel Claridges"
  },
  {
    "latitude": "28.6316372",
    "longitude": "77.2158857",
    "name": "EESL Indian Coffee House"
  },
  {
    "latitude": "28.600324",
    "longitude": "77.226883",
    "name": "EESL Khan Market"
  },
  {
    "latitude": "28.585367",
    "longitude": "77.17755",
    "name": "EESL Charak Palika Hospital"
  },
  {
    "latitude": "28.601201",
    "longitude": "77.215975",
    "name": "EESL Hotel Claridges 1"
  },
  {
    "latitude": "28.628528",
    "longitude": "77.21946",
    "name": "EESL Janpath Guest House"
  },
  {
    "latitude": "28.600324",
    "longitude": "77.226883",
    "name": "EESL Khan Market"
  },
  {
    "latitude": "28.63407",
    "longitude": "77.217683",
    "name": "EESL Block H"
  },
  {
    "latitude": "28.585367",
    "longitude": "77.17755",
    "name": "EESL Charak Palika Hospital"
  },
  {
    "latitude": "28.63363",
    "longitude": "77.221949",
    "name": "EESL KTM"
  },
  {
    "latitude": "28.6182604",
    "longitude": "77.2125699",
    "name": "EESL Chelmsford Club"
  },
  {
    "latitude": "28.6182604",
    "longitude": "77.2125699",
    "name": "EESL Chelmsford Club"
  },
  {
    "latitude": "28.586638",
    "longitude": "77.193352",
    "name": "EESL PSOI Club"
  },
  {
    "latitude": "28.6182604",
    "longitude": "77.2125699",
    "name": "EESL Chelmsford Club"
  },
  {
    "latitude": "28.6182604",
    "longitude": "77.2125699",
    "name": "EESL Chelmsford Club"
  },
  {
    "latitude": "28.586638",
    "longitude": "77.193352",
    "name": "EESL PSOI Club"
  },
  {
    "latitude": "28.6182604",
    "longitude": "77.2125699",
    "name": "EESL Chelmsford Club"
  },
  {
    "latitude": "28.590402",
    "longitude": "77.220192",
    "name": "EESL Lodhi Garden"
  },
  {
    "latitude": "28.622004",
    "longitude": "77.194962",
    "name": "EESL Talkatora Stadium"
  },
  {
    "latitude": "28.622004",
    "longitude": "77.194962",
    "name": "EESL Talkatora Stadium"
  },
  {
    "latitude": "28.6285",
    "longitude": "77.217046"
  },
  {
    "latitude": "28.6235305",
    "longitude": "77.1956795",
    "name": "EESL Talkatora Garden"
  },
  {
    "latitude": "28.6235305",
    "longitude": "77.1956795",
    "name": "EESL Talkatora Garden"
  },
  {
    "latitude": "28.572793",
    "longitude": "77.208662",
    "name": "EESL Delhi Haat"
  },
  {
    "latitude": "28.583518",
    "longitude": "77.222057",
    "name": "EESL Palika Maternity Hospital"
  },
  {
    "latitude": "28.590402",
    "longitude": "77.220192",
    "name": "EESL Lodhi Garden"
  },
  {
    "latitude": "28.572793",
    "longitude": "77.208662",
    "name": "EESL Delhi Haat"
  },
  {
    "latitude": "28.572793",
    "longitude": "77.208662",
    "name": "EESL Delhi Haat"
  },
  {
    "latitude": "28.5842756",
    "longitude": "77.3137535",
    "name": "EESL Noida Authority Parking Sector 2 Noida"
  },
  {
    "latitude": "28.578614",
    "longitude": "77.317483",
    "name": "EESL Sector 16 Near Metro Station Noida"
  },
  {
    "latitude": "28.36374688",
    "longitude": "77.27384312",
    "name": "EESL Marie Gold Exports Block A Sector 64 Noida"
  },
  {
    "latitude": "28.6132",
    "longitude": "77.3814",
    "name": "EESL Hexagon Sector 65 Noida"
  },
  {
    "latitude": "15.588",
    "longitude": "73.8139",
    "name": "EESL Mamlatdar Office Mapusa Goa"
  }];

Station.insertMany(stations)
    .then(() => {
        console.log("Stations added successfully");
        mongoose.connection.close();
    })
    .catch(err => console.error("Error inserting stations:", err));
