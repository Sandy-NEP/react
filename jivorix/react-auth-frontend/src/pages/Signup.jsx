import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';
import { FaUserAlt } from "react-icons/fa";
import { CgMail } from 'react-icons/cg';
import { FaMobile } from "react-icons/fa";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { MdOutlineBadge } from "react-icons/md";
import { FaTransgender } from "react-icons/fa";

function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    province: '',
    postcode: '',
    dateOfBirth: '',
    nationalId: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    province: '',
    postcode: '',
    dateOfBirth: '',
    nationalId: '',
    gender: ''
  });
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [middleNameFocused, setMiddleNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);
  const [provinceFocused, setProvinceFocused] = useState(false);
  const [postcodeFocused, setPostcodeFocused] = useState(false);
  const [dateOfBirthFocused, setDateOfBirthFocused] = useState(false);
  const [nationalIdFocused, setNationalIdFocused] = useState(false);
  const [genderFocused, setGenderFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Address data
  const addressData = {
    "Koshi Province": {
      "Ilam": [
        { "name": "Ilam", "postcode": "57300" },
        { "name": "Nayabazar", "postcode": "57302" },
        { "name": "Pashupatinagar", "postcode": "57303" },
        { "name": "Aaitabare", "postcode": "57304" },
        { "name": "Harkatebazar", "postcode": "57305" },
        { "name": "Gajurmukhi", "postcode": "57306" },
        { "name": "Mangal Bare", "postcode": "57307" },
        { "name": "Nepaltar", "postcode": "57308" },
        { "name": "Jamuna", "postcode": "57309" },
        { "name": "Gitpur", "postcode": "57310" },
        { "name": "Cheesa Pani Panchami", "postcode": "57311" },
        { "name": "Phikal", "postcode": "57312" }
      ],
      "Bhojpur": [
        { "name": "Bhojpur", "postcode": "57000" },
        { "name": "Kulung Agrakhe", "postcode": "57001" },
        { "name": "Dingle", "postcode": "57002" },
        { "name": "Deurali", "postcode": "57003" },
        { "name": "Pauli", "postcode": "57004" },
        { "name": "Yaku", "postcode": "57005" },
        { "name": "Bastim", "postcode": "57006" },
        { "name": "Timma", "postcode": "57008" },
        { "name": "Dilpa Annapurna", "postcode": "57009" },
        { "name": "Bhulke", "postcode": "57010" },
        { "name": "Baikunthe", "postcode": "57011" },
        { "name": "Ribas", "postcode": "57012" },
        { "name": "Walangkha", "postcode": "57013" },
        { "name": "Tiwari Bhanjyang", "postcode": "57014" },
        { "name": "Dobhane", "postcode": "57015" }
      ],
      "Dhankuta": [
        { "name": "Dhankuta", "postcode": "56800" },
        { "name": "Hile", "postcode": "56801" },
        { "name": "Bhedetar", "postcode": "56802" },
        { "name": "Muga", "postcode": "56803" },
        { "name": "Rajarani", "postcode": "56804" },
        { "name": "Ankhisalla", "postcode": "56805" },
        { "name": "Leguwa", "postcode": "56806" },
        { "name": "Murtidhunga", "postcode": "56807" },
        { "name": "Dandabazar", "postcode": "56808" },
        { "name": "Ahale", "postcode": "56809" }
      ],
      "Jhapa": [
        { "name": "Jhapa", "postcode": "57200" },
        { "name": "Damak", "postcode": "57201" },
        { "name": "Birtamod", "postcode": "57202" },
        { "name": "Kankai", "postcode": "57203" },
        { "name": "Chandragadhi", "postcode": "57204" },
        { "name": "Anarmani", "postcode": "57205" },
        { "name": "Kakarbhitta", "postcode": "57206" },
        { "name": "Surunga", "postcode": "57207" },
        { "name": "Charpane", "postcode": "57208" },
        { "name": "Gauradaha", "postcode": "57209" },
        { "name": "Shivaganj", "postcode": "57210" },
        { "name": "Dudhe", "postcode": "57211" },
        { "name": "Budhabare", "postcode": "57212" }
      ],
      "Khotang": [
        { "name": "Khotang", "postcode": "56200" },
        { "name": "Diktel", "postcode": "56201" },
        { "name": "Halesi", "postcode": "56202" },
        { "name": "Aiselukharka", "postcode": "56203" },
        { "name": "Lamidanda", "postcode": "56204" },
        { "name": "Jalpa", "postcode": "56205" }
      ],
      "Morang": [
        { "name": "Morang", "postcode": "56600" },
        { "name": "Biratnagar", "postcode": "56601" },
        { "name": "Rangeli", "postcode": "56602" },
        { "name": "Urlabari", "postcode": "56603" },
        { "name": "Letang", "postcode": "56604" },
        { "name": "Pathari", "postcode": "56605" },
        { "name": "Itahari", "postcode": "56606" },
        { "name": "Belbari", "postcode": "56607" },
        { "name": "Bayarban", "postcode": "56608" },
        { "name": "Sundarpur", "postcode": "56609" }
      ],
      "Okhaldhunga": [
        { "name": "Okhaldhunga", "postcode": "56100" },
        { "name": "Rumjatar", "postcode": "56101" },
        { "name": "Manebhanjyang", "postcode": "56102" },
        { "name": "Okhaldhunga Bazar", "postcode": "56103" },
        { "name": "Baruneshwor", "postcode": "56104" },
        { "name": "Ratmate", "postcode": "56105" }
      ],
      "Panchthar": [
        { "name": "Panchthar", "postcode": "57400" },
        { "name": "Phidim", "postcode": "57401" },
        { "name": "Yasok", "postcode": "57402" },
        { "name": "Rabi", "postcode": "57403" },
        { "name": "Nawamidanda", "postcode": "57404" }
      ],
      "Sankhuwasabha": [
        { "name": "Sankhuwasabha", "postcode": "56900" },
        { "name": "Hatiya", "postcode": "56901" },
        { "name": "Telangana", "postcode": "56902" },
        { "name": "Tamku", "postcode": "56903" },
        { "name": "Chandanpur", "postcode": "56904" },
        { "name": "Bahrabise", "postcode": "56905" },
        { "name": "Tumlingtar", "postcode": "56906" },
        { "name": "Wana", "postcode": "56907" },
        { "name": "Shidhakali", "postcode": "56908" },
        { "name": "Madi", "postcode": "56909" },
        { "name": "Ankhibhui", "postcode": "56910" },
        { "name": "Mailing", "postcode": "56911" },
        { "name": "Manebhanjyang", "postcode": "56912" },
        { "name": "Chainpur", "postcode": "56913" }
      ],
      "Sunsari": [
        { "name": "Sunsari", "postcode": "56700" },
        { "name": "Itahari", "postcode": "56701" },
        { "name": "Inaruwa", "postcode": "56702" },
        { "name": "Duhabi", "postcode": "56703" },
        { "name": "Bhadgau Sinuwari", "postcode": "56704" },
        { "name": "Chatara", "postcode": "56705" },
        { "name": "Barahachhetra", "postcode": "56706" },
        { "name": "Prakashpur", "postcode": "56707" },
        { "name": "Jhumka", "postcode": "56708" }
      ]
    },
    "Madhesh Province": {
      "Bara": [
        { "name": "Kalaiya", "postcode": "44400" },
        { "name": "Nijgadh", "postcode": "44401" },
        { "name": "Mahendra Adarsha", "postcode": "44402" },
        { "name": "Simraungadh", "postcode": "44403" },
        { "name": "Ajman", "postcode": "44404" },
        { "name": "Bariyarpur", "postcode": "44405" },
        { "name": "Kabahigoth", "postcode": "44406" },
        { "name": "Dumarwana", "postcode": "44408" },
        { "name": "Pipradhigoth", "postcode": "44410" },
        { "name": "Basantapur", "postcode": "44411" },
        { "name": "Simara", "postcode": "44412" },
        { "name": "Parsauna", "postcode": "44413" },
        { "name": "Amalekhgunj", "postcode": "44416" },
        { "name": "Jeetpur", "postcode": "44417" }
      ],
      "Dhanusha": [
        { "name": "Janakpur", "postcode": "45600" },
        { "name": "Dhalkebar", "postcode": "45617" },
        { "name": "Chhireshwarnath", "postcode": "45600" },
        { "name": "Ganeshman Charnath", "postcode": "45600" },
        { "name": "Dhanusadham", "postcode": "45600" }
      ],
      "Mahottari": [
        { "name": "Jaleshwar", "postcode": "45700" },
        { "name": "Bardibas", "postcode": "45701" },
        { "name": "Gaushala", "postcode": "45700" },
        { "name": "Balawa", "postcode": "45700" },
        { "name": "Manara Shiswa", "postcode": "45700" }
      ],
      "Parsa": [
        { "name": "Birgunj", "postcode": "44300" },
        { "name": "Parsa", "postcode": "44301" },
        { "name": "Pokhariya", "postcode": "44300" },
        { "name": "Bahudarmai", "postcode": "44300" }
      ],
      "Rautahat": [
        { "name": "Gaur", "postcode": "44500" },
        { "name": "Chandrapur", "postcode": "44501" },
        { "name": "Garuda", "postcode": "44500" },
        { "name": "Brindaban", "postcode": "44500" }
      ],
      "Saptari": [
        { "name": "Rajbiraj", "postcode": "56400" },
        { "name": "Hanuman Nagar", "postcode": "56401" },
        { "name": "Barabas", "postcode": "56402" },
        { "name": "Phattepur", "postcode": "56403" },
        { "name": "Kanchanpur", "postcode": "56404" },
        { "name": "Praswani", "postcode": "56405" },
        { "name": "Bhagwatpur", "postcode": "56406" },
        { "name": "Khiladi", "postcode": "56407" },
        { "name": "Chhinnamasta", "postcode": "56408" },
        { "name": "Bishnupur", "postcode": "56409" },
        { "name": "Rupani", "postcode": "56411" },
        { "name": "Pato", "postcode": "56412" },
        { "name": "Aranha", "postcode": "56413" },
        { "name": "Kalyanpur", "postcode": "56414" },
        { "name": "Bodebarsain", "postcode": "56415" },
        { "name": "Misawa", "postcode": "56416" },
        { "name": "Kadarwona", "postcode": "56417" },
        { "name": "Bhardaha", "postcode": "56418" }
      ],
      "Sarlahi": [
        { "name": "Malangwa", "postcode": "45800" },
        { "name": "Hariwan", "postcode": "45801" },
        { "name": "Barhathwa", "postcode": "45802" },
        { "name": "Lalbandi", "postcode": "45803" },
        { "name": "Nawalpur", "postcode": "45804" },
        { "name": "Ishwarpur", "postcode": "45805" },
        { "name": "Haripur", "postcode": "45800" },
        { "name": "Godaita", "postcode": "45800" },
        { "name": "Balara", "postcode": "45800" }
      ],
      "Siraha": [
        { "name": "Siraha", "postcode": "56500" },
        { "name": "Lahan", "postcode": "56502" },
        { "name": "Golbazar", "postcode": "56500" },
        { "name": "Dhangadimai", "postcode": "56500" },
        { "name": "Kalyanpur", "postcode": "56500" }
      ]
    },
    "Bagmati Province": {
      "Kathmandu": [
        { name: "Kathmandu", postcode: "44600" },
        { name: "Balaju", postcode: "44611" },
        { name: "Baluwatar", postcode: "44616" },
        { name: "Bansbari", postcode: "44606" },
        { name: "Budhanilkantha", postcode: "44622" },
        { name: "Chabahil", postcode: "44602" },
        { name: "Dillibazar", postcode: "44605" },
        { name: "Gauchar", postcode: "44604" },
        { name: "Kalimati", postcode: "44614" },
        { name: "Kirtipur", postcode: "44618" },
        { name: "Manmaiju", postcode: "44610" },
        { name: "Pashupati", postcode: "44621" },
        { name: "Pharping", postcode: "44615" },
        { name: "Sachibalaya", postcode: "44609" },
        { name: "Sankhu", postcode: "44601" },
        { name: "Sarbochcha Adalat", postcode: "44617" },
        { name: "Sundarijal", postcode: "44603" },
        { name: "Swayambhu", postcode: "44620" },
        { name: "Thankot", postcode: "44619" },
        { name: "Tokha Saraswati", postcode: "44608" },
        { name: "Tribhuvan University", postcode: "44613" }
      ],
      "Dhading": [
        { name: "Dhading", postcode: "45100" },
        { name: "Bhumisthan", postcode: "45111" },
        { name: "Gajuri", postcode: "45112" },
        { name: "Katunje", postcode: "45105" },
        { name: "Khanikhola", postcode: "45110" },
        { name: "Lapa", postcode: "45101" },
        { name: "Maidi", postcode: "45109" },
        { name: "Malekhu", postcode: "45113" },
        { name: "Phulkharka", postcode: "45103" },
        { name: "Sertung", postcode: "45102" },
        { name: "Sunaulabazar", postcode: "45108" },
        { name: "Sunkhani", postcode: "45106" },
        { name: "Tripureshwor", postcode: "45104" }
      ],
      "Dolakha": [
        { name: "Dolakha", postcode: "45500" },
        { name: "Bhusapheda", postcode: "45507" },
        { name: "Chitre", postcode: "45512" },
        { name: "Japhekalapani", postcode: "45505" },
        { name: "Jiri", postcode: "45503" },
        { name: "Khahare", postcode: "45501" },
        { name: "Khopachangu", postcode: "45510" },
        { name: "Lamabagar", postcode: "45511" },
        { name: "Melung", postcode: "45506" },
        { name: "Namdu", Postcode: "45502" },
        { name: "Sunkhani", postcode: "45509" }
      ]
    },
    "Gandaki Province": {
      "Kaski": [
        { name: "Pokhara", postcode: "33700" },
        { name: "Lakeside", postcode: "33701" },
        { name: "Bagar", postcode: "33702" },
        { name: "Bijayapur", postcode: "33703" },
        { name: "Hemja", postcode: "33704" },
        { name: "Syangja", postcode: "33705" },
        { name: "Naudanda", postcode: "33706" },
        { name: "Pumdibhumdi", postcode: "33707" },
        { name: "Ghandruk", postcode: "33708" },
        { name: "Dhampus", postcode: "33709" },
        { name: "Australian Camp", postcode: "33710" },
        { name: "Sarangkot", postcode: "33711" },
        { name: "Matepani", postcode: "33712" }
      ],
      "Lamjung": [
        { name: "Besisahar", postcode: "33600" },
        { name: "Khudi", postcode: "33601" },
        { name: "Sundarbazar", postcode: "33602" },
        { name: "Gaunshahar", postcode: "33603" },
        { name: "Bhoteodar", postcode: "33604" },
        { name: "Chandisthan", postcode: "33605" },
        { name: "Tarkughat", postcode: "33606" },
        { name: "Dordi", postcode: "33607" },
        { name: "Marsyangdi", postcode: "33608" }
      ],
      "Manang": [
        { name: "Chame", postcode: "33500" },
        { name: "Manang", postcode: "33501" },
        { name: "Pisang", postcode: "33502" },
        { name: "Humde", postcode: "33503" },
        { name: "Ngawal", postcode: "33504" },
        { name: "Braga", postcode: "33505" },
        { name: "Khangsar", postcode: "33506" }
      ],
      "Mustang": [
        { name: "Jomsom", postcode: "33100" },
        { name: "Kagbeni", postcode: "33101" },
        { name: "Muktinath", postcode: "33102" },
        { name: "Marpha", postcode: "33103" },
        { name: "Tukuche", postcode: "33104" },
        { name: "Lomanthang", postcode: "33105" },
        { name: "Chhoser", postcode: "33106" },
        { name: "Lo-Manthang", postcode: "33107" }
      ],
      "Myagdi": [
        { name: "Beni", postcode: "33200" },
        { name: "Galeshwor", postcode: "33201" },
        { name: "Dana", postcode: "33202" },
        { name: "Mudi", postcode: "33203" },
        { name: "Darbang", postcode: "33204" },
        { name: "Babiyachaur", postcode: "33205" },
        { name: "Takam", postcode: "33206" },
        { name: "Raghuganga", postcode: "33207" }
      ],
      "Nawalpur": [
        { name: "Kawasoti", postcode: "33000" },
        { name: "Gaidakot", postcode: "33001" },
        { name: "Devchuli", postcode: "33002" },
        { name: "Madhyabindu", postcode: "33003" },
        { name: "Binayi Tribeni", postcode: "33004" },
        { name: "Bardaghat", postcode: "33005" },
        { name: "Ramgram", postcode: "33006" }
      ],
      "Parbat": [
        { name: "Kusma", postcode: "33400" },
        { name: "Phalebas", postcode: "33401" },
        { name: "Modi", postcode: "33402" },
        { name: "Bihadi", postcode: "33403" },
        { name: "Lunkhu Deurali", postcode: "33404" },
        { name: "Paiyun", postcode: "33405" }
      ],
      "Syangja": [
        { name: "Putalibazar", postcode: "33800" },
        { name: "Waling", postcode: "33801" },
        { name: "Chapakot", postcode: "33802" },
        { name: "Arjunchaupari", postcode: "33803" },
        { name: "Galyang", postcode: "33804" },
        { name: "Biruwa", postcode: "33805" },
        { name: "Fedikhola", postcode: "33806" }
      ],
      "Tanahu": [
        { name: "Damauli", postcode: "33900" },
        { name: "Shuklagandaki", postcode: "33901" },
        { name: "Byas", postcode: "33902" },
        { name: "Bandipur", postcode: "33903" },
        { name: "Bhanu", postcode: "33904" },
        { name: "Ghiring", postcode: "33905" },
        { name: "Devghat", postcode: "33906" }
      ]
    },
    "Lumbini Province": {
      "Rupandehi": [
        { name: "Rupandehi", postcode: "32900" },
        { name: "Siktahan", postcode: "32901" },
        { name: "Dhakadhai", postcode: "32902" },
        { name: "Manigram", postcode: "32903" },
        { name: "Kotihawa", postcode: "32904" },
        { name: "Thutipipal", postcode: "32905" },
        { name: "Butwal", postcode: "32907" },
        { name: "Perroha", postcode: "32908" },
        { name: "Sauraha Pharsa", postcode: "32909" },
        { name: "Amuwa", postcode: "32910" },
        { name: "Saljhandi", postcode: "32911" },
        { name: "Suryapura", postcode: "32912" },
        { name: "Tenuhawa", postcode: "32913" },
        { name: "Lumbini", postcode: "32914" },
        { name: "Betkuiya", postcode: "32915" },
        { name: "Mahadehiya", postcode: "32916" }
      ],
      "Kapilbastu": [
        { name: "Kapilbastu", postcode: "32800" },
        { name: "Pipara", postcode: "32801" },
        { name: "Patariya", postcode: "32802" },
        { name: "Pakadi", postcode: "32804" },
        { name: "Kopawa", postcode: "32805" },
        { name: "Gotihawa", postcode: "32808" },
        { name: "Grusinge", postcode: "32809" },
        { name: "Pattharkot", postcode: "32810" },
        { name: "Thuniya", postcode: "32811" },
        { name: "Maharajgung", postcode: "32812" },
        { name: "Ganeshpur", postcode: "32813" },
        { name: "Chanauta", postcode: "32814" },
        { name: "Krishnanagar", postcode: "32815" },
        { name: "Shiva Raj", postcode: "32816" }
      ]
    },
    "Karnali Province": {
      "Dailekh": [
        { name: "Dailekh", postcode: "21600" },
        { name: "Narayan", postcode: "21601" },
        { name: "Dullu", postcode: "21602" },
        { name: "Chamunda", postcode: "21603" },
        { name: "Guranshe", postcode: "21604" },
        { name: "Bhairabi", postcode: "21605" },
        { name: "Naumule", postcode: "21606" }
      ],
      "Dolpa": [
        { name: "Dunai", postcode: "21400" },
        { name: "Juphal", postcode: "21401" },
        { name: "Tripurasundari", postcode: "21402" },
        { name: "Shey Phoksundo", postcode: "21403" },
        { name: "Chharka", postcode: "21404" },
        { name: "Kaigaun", postcode: "21405" }
      ],
      "Humla": [
        { name: "Simikot", postcode: "21200" },
        { name: "Thehe", postcode: "21201" },
        { name: "Yari", postcode: "21202" },
        { name: "Muchu", postcode: "21203" },
        { name: "Todpa", postcode: "21204" },
        { name: "Yalbang", postcode: "21205" }
      ],
      "Jajarkot": [
        { name: "Khalanga", postcode: "21500" },
        { name: "Bheri", postcode: "21501" },
        { name: "Ragda", postcode: "21502" },
        { name: "Chhedagad", postcode: "21503" },
        { name: "Junichande", postcode: "21504" },
        { name: "Nalgad", postcode: "21505" }
      ],
      "Jumla": [
        { name: "Jumla", postcode: "21100" },
        { name: "Chandannath", postcode: "21101" },
        { name: "Tatopani", postcode: "21102" },
        { name: "Patarasi", postcode: "21103" },
        { name: "Guthichaur", postcode: "21104" },
        { name: "Hima", postcode: "21105" }
      ],
      "Kalikot": [
        { name: "Manma", postcode: "21300" },
        { name: "Raskot", postcode: "21301" },
        { name: "Sanni Triveni", postcode: "21302" },
        { name: "Pachaljharana", postcode: "21303" },
        { name: "Naraharinath", postcode: "21304" },
        { name: "Mahawai", postcode: "21305" }
      ],
      "Mugu": [
        { name: "Gamgadhi", postcode: "21000" },
        { name: "Rara", postcode: "21001" },
        { name: "Khatyad", postcode: "21002" },
        { name: "Soru", postcode: "21003" },
        { name: "Mugum Karmarong", postcode: "21004" },
        { name: "Pulu", postcode: "21005" }
      ],
      "Rukum West": [
        { name: "Musikot", postcode: "22000" },
        { name: "Chaurjahari", postcode: "22001" },
        { name: "Sisne", postcode: "22002" },
        { name: "Aathbiskot", postcode: "22003" },
        { name: "Banfikot", postcode: "22004" },
        { name: "Kotjahari", postcode: "22005" }
      ],
      "Salyan": [
        { name: "Salyan", postcode: "21900" },
        { name: "Sharada", postcode: "21901" },
        { name: "Bagchaur", postcode: "21902" },
        { name: "Kalimati", postcode: "21903" },
        { name: "Darma", postcode: "21904" },
        { name: "Kapurkot", postcode: "21905" }
      ],
      "Surkhet": [
        { name: "Birendranagar", postcode: "21700" },
        { name: "Ghorahi", postcode: "21701" },
        { name: "Lekbesi", postcode: "21702" },
        { name: "Chhinchu", postcode: "21703" },
        { name: "Babiyachaur", postcode: "21704" },
        { name: "Bheriganga", postcode: "21705" },
        { name: "Gurbhakot", postcode: "21706" }
      ]
    },
    "Sudurpashchim Province": {
      "Kanchanpur": [
        { name: "Mahendranagar", postcode: "10900" },
        { name: "Belauri-1", postcode: "10901" },
        { name: "Shivnagar-1", postcode: "10902" },
        { name: "Krishnapur", postcode: "10903" },
        { name: "Bhimdatta", postcode: "10904" },
        { name: "Punarbas", postcode: "10905" },
        { name: "Suda", postcode: "10906" },
        { name: "Kanchanpur", postcode: "10907" },
        { name: "Gaddachauki", postcode: "10908" },
        { name: "Shivapur", postcode: "10909" },
        { name: "Beldandi", postcode: "10910" },
        { name: "Shivnagar-2", postcode: "10911" },
        { name: "Belauri-2", postcode: "10912" }
      ]
    }
  };

  const provinces = Object.keys(addressData);
  const getCities = (province) => {
    if (!province) {
      return Object.keys(addressData).flatMap(p => Object.keys(addressData[p])).sort();
    }
    return Object.keys(addressData[province] || {}).sort();
  };
  const getAddresses = (province, city) => {
    if (!city) {
      return Object.entries(addressData)
        .flatMap(([p, districts]) =>
          Object.entries(districts).flatMap(([d, addresses]) =>
            addresses.map(a => ({
              id: `${d}:${a.name}`,
              display: a.name
            }))
          )
        )
        .sort((a, b) => a.display.localeCompare(b.display));
    }
    if (!province) {
      return Object.entries(addressData)
        .flatMap(([p, districts]) =>
          Object.entries(districts).flatMap(([d, addresses]) =>
            d === city ? addresses.map(a => ({
              id: `${d}:${a.name}`,
              display: a.name
            })) : []
          )
        )
        .sort((a, b) => a.display.localeCompare(b.display));
    }
    return (addressData[province]?.[city] || []).map(a => ({
      id: `${city}:${a.name}`,
      display: a.name
    })).sort((a, b) => a.display.localeCompare(b.display));
  };
  const getPostcode = (province, city, addressId) => {
    if (!addressId || !city || !province) return '';
    const [, addressName] = addressId.split(':');
    return addressData[province]?.[city]?.find(a => a.name === addressName)?.postcode || '';
  };

  // Update postcode when address changes
  useEffect(() => {
    const postcode = getPostcode(formData.province, formData.city, formData.address);
    setFormData(prev => ({ ...prev, postcode }));
    setFieldErrors(prev => ({ ...prev, postcode: '' }));
  }, [formData.address, formData.city, formData.province]);

  // Reset city and address when province changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, city: '', address: '', postcode: '' }));
    setFieldErrors(prev => ({ ...prev, city: '', address: '', postcode: '' }));
  }, [formData.province]);

  // Reset address when city changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, address: '', postcode: '' }));
    setFieldErrors(prev => ({ ...prev, address: '', postcode: '' }));
  }, [formData.city]);

  // Redirect on success
  useEffect(() => {
    if

(isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStepOne = () => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    };
    let isValid = true;

    const nameRegex = /^(?!.*(\w)\1\1)[A-Za-z]{3,20}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@(gmail|yahoo|outlook)\.(com|in|org\.np)$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* )/;

    if (!formData.firstName) {
      errors.firstName = 'Please fill First Name';
      isValid = false;
    } else if (!nameRegex.test(formData.firstName)) {
      errors.firstName = 'First Name must be 3-20 characters with no more than 2 consecutive identical characters';
      isValid = false;
    }

    if (!formData.lastName) {
      errors.lastName = 'Please fill Last Name';
      isValid = false;
    } else if (!nameRegex.test(formData.lastName)) {
      errors.lastName = 'Last Name must be 3-20 characters with no more than 2 consecutive identical characters';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Please fill Email';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid Email Format (use gmail, yahoo, or outlook with .com, .in, or .org.np)';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Please fill Password';
      isValid = false;
    } else if (formData.password.length < 6 || formData.password.length > 20) {
      errors.password = 'Password must be between 6 and 20 characters';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = 'Password must contain Uppercase, Lowercase, Number & Symbols (no spaces)';
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = 'Please fill mobile number';
      isValid = false;
    } else if (isNaN(formData.phone)) {
      errors.phone = 'Only numbers are valid';
      isValid = false;
    } else if (formData.phone.length !== 10) {
      errors.phone = 'Phone number must be 10 digits';
      isValid = false;
    } else if (!formData.phone.startsWith('97') && !formData.phone.startsWith('98')) {
      errors.phone = 'Phone number must start with 97 or 98';
      isValid = false;
    }

    setFieldErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  const validateStepTwo = () => {
    const errors = {
      address: '',
      city: '',
      province: '',
      postcode: '',
      dateOfBirth: '',
      nationalId: '',
      gender: ''
    };
    let isValid = true;

    if (!formData.province) {
      errors.province = 'Please select Province';
      isValid = false;
    }
    if (!formData.city) {
      errors.city = 'Please select City';
      isValid = false;
    }
    if (!formData.address) {
      errors.address = 'Please select Address';
      isValid = false;
    }
    if (!formData.postcode) {
      errors.postcode = 'Please select an Address to set Postcode';
      isValid = false;
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Please fill Date of Birth';
      isValid = false;
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(formData.dateOfBirth)) {
        errors.dateOfBirth = 'Date of Birth must be in YYYY-MM-DD format';
        isValid = false;
      } else if (isNaN(dob.getTime())) {
        errors.dateOfBirth = 'Invalid Date of Birth';
        isValid = false;
      } else if (dob > today) {
        errors.dateOfBirth = 'Date of Birth cannot be in the future';
        isValid = false;
      } else if (dob > minAgeDate) {
        errors.dateOfBirth = 'You must be at least 18 years old';
        isValid = false;
      }
    }
    if (!formData.nationalId) {
      errors.nationalId = 'Please fill National ID';
      isValid = false;
    }
    if (!formData.gender) {
      errors.gender = 'Please select Gender';
      isValid =-market
    };

    setFieldErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStepOne()) {
      setError('');
      setStep(2);
    } else {
      setError('Please correct the errors in the form.');
      setShowErrorPopup(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStepTwo()) {
      setError('Please correct the errors in the form.');
      setShowErrorPopup(true);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      console.log('Submitting formData:', formData);
      const payload = {
        ...formData,
        state: formData.province
      };
      const response = await axios.post('http://localhost/react-auth-backend/signup.php'||'http://192.168.1.65/react-auth-backend/signup.php', payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      if (response.data.success) {
        setTimeout(() => {
          setIsLoading(false);
          setIsSuccess(true);
        }, 3000);
      } else {
        setIsLoading(false);
        setError(response.data.message || 'Registration failed');
        setShowErrorPopup(true);
      }
    } catch (err) {
      setIsLoading(false);
      let errorMessage = 'An error occurred. Please try again.';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setShowErrorPopup(true);
      console.error('Signup error:', err, err.response?.data);
    }
  };
// Social login handler
  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost/react-auth-backend/social-auth.php?provider=${provider}`;
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setError('');
  };

  const stepOneFields = [
    { label: 'First Name*', name: 'firstName', value: formData.firstName, focused: firstNameFocused, setFocused: setFirstNameFocused, Icon: FaUserAlt },
    { label: 'Middle Name', name: 'middleName', value: formData.middleName, focused: middleNameFocused, setFocused: setMiddleNameFocused, Icon: FaUserAlt },
    { label: 'Last Name*', name: 'lastName', value: formData.lastName, focused: lastNameFocused, setFocused: setLastNameFocused, Icon: FaUserAlt },
    { label: 'Email Address*', name: 'email', value: formData.email, focused: emailFocused, setFocused: setEmailFocused, Icon: CgMail, type: 'email' },
    { label: 'Phone Number*', name: 'phone', value: formData.phone, focused: phoneFocused, setFocused: setPhoneFocused, Icon: FaMobile, type: 'tel' }
  ];

  const stepTwoFields = [
    {
      label: 'Province*',
      name: 'province',
      value: formData.province,
      focused: provinceFocused,
      setFocused: setProvinceFocused,
      Icon: FaMapMarkerAlt,
      type: 'select',
      options: provinces
    },
    {
      label: 'City*',
      name: 'city',
      value: formData.city,
      focused: cityFocused,
      setFocused: setCityFocused,
      Icon: FaMapMarkerAlt,
      type: 'select',
      options: getCities(formData.province),
      disabled: !provinces.length
    },
    {
      label: 'Address*',
      name: 'address',
      value: formData.address,
      focused: addressFocused,
      setFocused: setAddressFocused,
      Icon: FaMapMarkerAlt,
      type: 'select',
      options: getAddresses(formData.province, formData.city),
      disabled: !getCities(formData.province).length
    },
    {
      label: 'Postcode*',
      name: 'postcode',
      value: formData.postcode,
      focused: postcodeFocused,
      setFocused: setPostcodeFocused,
      Icon: FaMapMarkerAlt,
      type: 'text',
      readOnly: true,
      hidden: !formData.address
    },
    { label: 'Date of Birth*', name: 'dateOfBirth', value: formData.dateOfBirth, focused: dateOfBirthFocused, setFocused: setDateOfBirthFocused, Icon: BsCalendarDate, type: 'date' },
    { label: 'National ID*', name: 'nationalId', value: formData.nationalId, focused: nationalIdFocused, setFocused: setNationalIdFocused, Icon: MdOutlineBadge },
    {
      label: 'Gender*',
      name: 'gender',
      value: formData.gender,
      focused: genderFocused,
      setFocused: setGenderFocused,
      Icon: FaTransgender,
      type: 'select',
      options: ['Male', 'Female', 'Other']
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#FDEDD9] to-[#f8cfa0] flex items-center justify-center p-4 animate-fade-in">
      <style>
        {`
          .circle-loader {
            margin: 0 auto 30px;
            border: 2px solid rgba(0, 0, 0, 0.2);
            border-left-color: #228ae6;
            animation: loader-spin 1s infinite linear;
            position: relative;
            display: inline-block;
            vertical-align: top;
            border-radius: 50%;
            width: 8em;
            height: 8em;
          }
          .checkmark {
            display: none;
          }
          .checkmark.draw:after {
            animation: checkmark 1.2s ease;
            transform: scaleX(-1) rotate(135deg);
          }
          .checkmark:after {
            opacity: 1;
            height: 4em;
            width: 2em;
            transform-origin: left top;
            border-right: 2px solid #396f3a;
            border-top: 2px solid #396f3a;
            content: '';
            left: 2em;
            top: 4em;
            position: absolute;
          }
          .load-complete.load-success {
            animation: none;
            border-color: #396f3a;
            transition: border 500ms ease-out;
          }
          .load-complete .checkmark {
            display: block;
          }
          @keyframes loader-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes checkmark {
            0% { height: 0; width: 0; opacity: 1; }
            20% { height: 0; width: 2em; opacity: 1; }
            40% { height: 4em; width: 2em; opacity: 1; }
            100% { height: 4em; width: 2em; opacity: 1; }
          }
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-in;
          }
        `}
      </style>

      {(isLoading || isSuccess) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            {isLoading ? (
              <>
                <div className="circle-loader"></div>
                <p className="text-[#6f4e37] text-lg">Processing...</p>
              </>
            ) : (
              <>
                <div className="circle-loader load-complete load-success">
                  <div className="checkmark draw"></div>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Account Created Successfully!</h3>
                <p className="text-[#6f4e37]">Redirecting to login...</p> 
              </>
            )}
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-red-600 mb-4">Validation Errors</h3>
            <p className="text-[#6f4e37] mb-4">{error}</p>
            <ul className="list-disc list-inside text-[#6f4e37] mb-4">
              {Object.entries(fieldErrors)
                .filter(([_, error]) => error)
                .map(([field, error]) => (
                  <li key={field} className="text-sm">
                    {field === 'firstName' && 'First Name: '}
                    {field === 'lastName' && 'Last Name: '}
                    {field === 'email' && 'Email: '}
                    {field === 'phone' && 'Phone: '}
                    {field === 'password' && 'Password: '}
                    {field === 'address' && 'Address: '}
                    {field === 'city' && 'City: '}
                    {field === 'province' && 'Province: '}
                    {field === 'postcode' && 'Postcode: '}
                    {field === 'dateOfBirth' && 'Date of Birth: '}
                    {field === 'nationalId' && 'National ID: '}
                    {field === 'gender' && 'Gender: '}
                    {error}
                  </li>
                ))}
            </ul>
            <button
              onClick={closeErrorPopup}
              className="w-full bg-[#6f4e37] text-white py-2 px-4 rounded-full hover:bg-[#5a3c2e] shadow-lg transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <section className="hidden lg:flex items-center justify-center">
          <img
            src={assets.signup}
            alt="signup banner"
            loading="lazy"
            className="w-full h-auto max-h-[600px] object-contain animate-fade-in"
          />
        </section>

        <section className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 w-full transition-all duration-500 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#6f4e37] mb-6">
            Create Account - Step {step} of 2
          </h1>

          {error && !showErrorPopup && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                {stepOneFields.map((field, idx) => (
                  <div className="relative" key={idx}>
                    <label className={`absolute left-2 transition-all duration-300 ${
                      (field.focused || field.value) ? 'text-xs text-[#6f4e37] -translate-y-5' : 'text-gray-500 top-1/2 -translate-y-1/2'
                    }`}>
                      {field.label}
                    </label>
                    <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      (field.focused || field.value) ? 'text-[#6f4e37]' : 'text-gray-400'
                    }`}>
                      <field.Icon className="text-lg" />
                    </div>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={field.value}
                      onChange={handleInputChange}
                      onFocus={() => field.setFocused(true)}
                      onBlur={() => !field.value && field.setFocused(false)}
                      required={field.label.includes('*')}
                      className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                    />
                  </div>
                ))}
                <div className="relative">
                  <label className={`absolute left-2 transition-all duration-300 ${
                    (passwordFocused || formData.password) ? 'text-xs text-[#6f4e37] -translate-y-5' : 'text-gray-500 top-1/2 -translate-y-1/2'
                  }`}>
                    Password*
                  </label>
                  {formData.password && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#6f4e37]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
                    </button>
                  )}
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => !formData.password && setPasswordFocused(false)}
                    required
                    className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                  />
                </div>
                <div className="pt-2">
                  <p className="text-sm text-center mb-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#6f4e37] hover:underline font-medium">Login</Link>
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-[#6f4e37] text-white py-2 px-4 rounded-full hover:bg-[#5a3c2e] shadow-lg transition duration-300"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                {stepTwoFields.map((field, idx) => (
                  <div className={`relative ${field.hidden ? 'hidden' : ''}`} key={idx}>
                    <label className={`absolute left-2 transition-all duration-300 ${
                      (field.focused || field.value) ? 'text-xs text-[#6f4e37] -translate-y-5' : 'text-gray-500 top-1/2 -translate-y-1/2'
                    }`}>
                      {field.label}
                    </label>
                    <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      (field.focused || field.value) ? 'text-[#6f4e37]' : 'text-gray-400'
                    }`}>
                      <field.Icon className="text-lg" />
                    </div>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={field.value}
                        onChange={handleInputChange}
                        onFocus={() => field.setFocused(true)}
                        onBlur={() => field.setFocused(false)}
                        required={field.label.includes('*')}
                        disabled={field.disabled}
                        className={`w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent appearance-none ${
                          field.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        style={{ color: field.focused || field.value ? 'inherit' : 'transparent' }}
                      >
                        <option value="" disabled style={{ color: field.focused || field.value ? 'inherit' : 'transparent' }}>
                          Select {field.label.replace('*', '')}
                        </option>
                        {field.options.map((option) => (
                          <option
                            key={typeof option === 'string' ? option : option.id}
                            value={typeof option === 'string' ? option : option.id}
                            style={{ color: 'black' }}
                          >
                            {typeof option === 'string' ? option : option.display}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={field.value}
                        onChange={handleInputChange}
                        onFocus={() => field.setFocused(true)}
                        onBlur={() => !field.value && field.setFocused(false)}
                        required={field.label.includes('*')}
                        placeholder={field.name === 'dateOfBirth' && field.focused ? '(YYYY-MM-DD)' : ''}
                        readOnly={field.readOnly}
                        className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                      />
                    )}
                  </div>
                ))}
                
                <div className="pt-2 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-300 text-[#6f4e37] py-2 px-4 rounded-full hover:bg-gray-400 shadow-lg transition duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-[#6f4e37] text-white py-2 px-4 rounded-full hover:bg-[#5a3c2e] shadow-lg transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-center mb-4 text-[#6f4e37]">Sign Up With</h2>
              <div className="flex justify-center gap-5">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform duration-300"
                >
                  <img src={assets.google} alt="google" loading="lazy" />
                </button>
                <button 
                  onClick={() => handleSocialLogin('facebook')}
                  className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform duration-300"
                >
                  <img src={assets.facebook} alt="facebook" loading="lazy" />
                </button>
                <button 
                  onClick={() => handleSocialLogin('instagram')}
                  className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform duration-300"
                >
                  <img src={assets.instagram} alt="instagram" loading="lazy" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Signup;