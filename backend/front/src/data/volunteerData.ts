import { VolunteerOpportunity } from '@/types/volunteer.types';

export const volunteerOpportunities: VolunteerOpportunity[] = [
  // Education Opportunities
  {
    id: 'edu-001',
    title: 'Korepetycje dla dzieci z trudnościami',
    description: 'Pomóż dzieciom ze szkół podstawowych w nauce matematyki i języka polskiego. Program skierowany do uczniów klas 1-6 z rodzin o trudnej sytuacji ekonomicznej.',
    organization: 'Fundacja Dobry Start',
    category: 'education',
    location: {
      address: 'ul. Floriańska 25, 31-021 Kraków',
      coordinates: [19.9387, 50.0647]
    },
    date: {
      start: '2024-10-01',
      end: '2024-12-20'
    },
    requirements: ['Komunikatywność', 'Cierpliwość', 'Podstawowa znajomość przedmiotu'],
    benefits: ['Doświadczenie pedagogiczne', 'Certyfikat wolontariusza', 'Satysfakcja z pomagania'],
    contactEmail: 'korepetycje@dobrystart.org',
    maxVolunteers: 15,
    currentVolunteers: 8,
    isUrgent: true,
    difficulty: 'easy',
    timeCommitment: '2 godziny tygodniowo'
  },
  {
    id: 'edu-002',
    title: 'Warsztaty programowania dla młodzieży',
    description: 'Prowadzenie zajęć z podstaw programowania w Python i JavaScript dla uczniów szkół średnich. Nowoczesne podejście do nauki kodowania.',
    organization: 'Krakowskie Centrum IT',
    category: 'education',
    location: {
      address: 'ul. Dietla 66, 31-039 Kraków',
      coordinates: [19.9482, 50.0542]
    },
    date: {
      start: '2024-11-15',
      end: '2025-03-15'
    },
    requirements: ['Znajomość Python lub JavaScript', 'Doświadczenie w programowaniu', 'Umiejętności interpersonalne'],
    benefits: ['Rozwój umiejętności mentorskich', 'Networking w branży IT', 'Referencje zawodowe'],
    contactEmail: 'warsztaty@krakowit.edu',
    maxVolunteers: 8,
    currentVolunteers: 3,
    difficulty: 'hard',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'edu-003',
    title: 'Czytanie bajek w przedszkolu',
    description: 'Organizowanie spotkań literackich dla dzieci w wieku 3-6 lat. Rozwijanie miłości do książek poprzez interaktywne czytanie i teatrzyki.',
    organization: 'Przedszkole "Słoneczko"',
    category: 'education',
    location: {
      address: 'ul. Kościuszki 45, 30-105 Kraków',
      coordinates: [19.9213, 50.0593]
    },
    date: {
      start: '2024-10-10',
      end: '2024-12-15'
    },
    requirements: ['Miłość do dzieci', 'Kreatywność', 'Punktualność'],
    benefits: ['Radość z pracy z dziećmi', 'Rozwój kreatywności', 'Doświadczenie edukacyjne'],
    contactEmail: 'bajki@sloneczko.krakow.pl',
    maxVolunteers: 6,
    currentVolunteers: 4,
    difficulty: 'easy',
    timeCommitment: '1 godzina tygodniowo'
  },
  {
    id: 'edu-004',
    title: 'Kurs języka polskiego dla obcokrajowców',
    description: 'Pomoc w nauce języka polskiego dla studentów zagranicznych i pracowników z innych krajów mieszkających w Krakowie.',
    organization: 'Centrum Integracji Międzykulturowej',
    category: 'education',
    location: {
      address: 'ul. Szewska 8, 31-009 Kraków',
      coordinates: [19.9349, 50.0615]
    },
    date: {
      start: '2024-10-05',
      end: '2025-06-30'
    },
    requirements: ['Znajomość języka angielskiego', 'Cierpliwość', 'Doświadczenie w nauczaniu (mile widziane)'],
    benefits: ['Kontakt z różnymi kulturami', 'Doskonalenie języków obcych', 'Networking międzynarodowy'],
    contactEmail: 'polski@integracja.krakow.pl',
    maxVolunteers: 12,
    currentVolunteers: 7,
    difficulty: 'medium',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'edu-005',
    title: 'Biblioteka cyfrowa - digitalizacja książek',
    description: 'Pomoc w digitalizacji starych książek i dokumentów historycznych. Tworzenie cyfrowego archiwum dziedzictwa kulturowego Krakowa.',
    organization: 'Biblioteka Jagiellońska',
    category: 'education',
    location: {
      address: 'al. Mickiewicza 22, 30-059 Kraków',
      coordinates: [19.9216, 50.0636]
    },
    date: {
      start: '2024-11-01',
      end: '2025-04-30'
    },
    requirements: ['Dokładność', 'Podstawowa znajomość komputera', 'Szacunek dla dziedzictwa kulturowego'],
    benefits: ['Kontakt z historycznymi dokumentami', 'Umiejętności cyfrowe', 'Wkład w zachowanie kultury'],
    contactEmail: 'digitalizacja@bj.uj.edu.pl',
    maxVolunteers: 10,
    currentVolunteers: 5,
    difficulty: 'medium',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'edu-006',
    title: 'Klub dyskusyjny dla seniorów',
    description: 'Prowadzenie cotygodniowych spotkań dyskusyjnych na tematy społeczne, kulturalne i historyczne dla osób starszych.',
    organization: 'Dom Kultury Senioralnej',
    category: 'education',
    location: {
      address: 'ul. Kalwaryjska 26, 30-504 Kraków',
      coordinates: [19.9543, 50.0489]
    },
    date: {
      start: '2024-10-08',
      end: '2025-05-30'
    },
    requirements: ['Komunikatywność', 'Szeroka wiedza ogólna', 'Empatia'],
    benefits: ['Intergeneracyjne doświadczenia', 'Rozwój osobisty', 'Satysfakcja społeczna'],
    contactEmail: 'dyskusje@seniorzy.krakow.pl',
    maxVolunteers: 4,
    currentVolunteers: 2,
    difficulty: 'medium',
    timeCommitment: '2 godziny tygodniowo'
  },
  {
    id: 'edu-007',
    title: 'Nauka obsługi komputera dla seniorów',
    description: 'Indywidualne i grupowe zajęcia z podstaw obsługi komputera, internetu i aplikacji mobilnych dla osób 60+.',
    organization: 'Cyfrowi Seniorzy Kraków',
    category: 'education',
    location: {
      address: 'ul. Pawia 5, 31-154 Kraków',
      coordinates: [19.9447, 50.0678]
    },
    date: {
      start: '2024-10-12',
      end: '2025-03-31'
    },
    requirements: ['Znajomość obsługi komputera', 'Cierpliwość', 'Umiejętności dydaktyczne'],
    benefits: ['Rozwój umiejętności mentorskich', 'Kontakt z seniorami', 'Kształtowanie cyfrowego społeczeństwa'],
    contactEmail: 'komputer@seniorzy.net',
    maxVolunteers: 8,
    currentVolunteers: 6,
    difficulty: 'easy',
    timeCommitment: '2 godziny tygodniowo'
  },

  // Ecology Opportunities
  {
    id: 'eco-001',
    title: 'Sprzątanie brzegów Wisły',
    description: 'Cotygodniowe akcje sprzątania brzegów Wisły w okolicach Bulwarów Wiślanych. Ochrona środowiska wodnego i miejsc rekreacji.',
    organization: 'EkoKraków',
    category: 'ecology',
    location: {
      address: 'Bulwary Wiślane, 30-109 Kraków',
      coordinates: [19.9395, 50.0543]
    },
    date: {
      start: '2024-10-01',
      end: '2025-09-30'
    },
    requirements: ['Dobra kondycja fizyczna', 'Chęć pracy na świeżym powietrzu', 'Własne rękawice ochronne'],
    benefits: ['Poprawa kondycji fizycznej', 'Kontakt z naturą', 'Realny wpływ na środowisko'],
    contactEmail: 'wisla@ekokrakow.org',
    maxVolunteers: 20,
    currentVolunteers: 12,
    isUrgent: true,
    difficulty: 'medium',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'eco-002',
    title: 'Sadzenie drzew w Parku Lotników',
    description: 'Duża akcja sadzenia nowych drzew i krzewów w ramach rewitalizacji Parku Lotników. Tworzenie zielonej przestrzeni dla mieszkańców.',
    organization: 'Zarząd Zieleni Miejskiej',
    category: 'ecology',
    location: {
      address: 'Park Lotników, ul. Lema, 30-001 Kraków',
      coordinates: [19.9584, 50.0892]
    },
    date: {
      start: '2024-11-05',
      end: '2024-11-25'
    },
    requirements: ['Dobra kondycja fizyczna', 'Chęć pracy fizycznej', 'Własne ubranie robocze'],
    benefits: ['Budowanie zielonego Krakowa', 'Praca w zespole', 'Satysfakcja z tworzenia'],
    contactEmail: 'sadzenie@zzm.krakow.pl',
    maxVolunteers: 50,
    currentVolunteers: 23,
    difficulty: 'medium',
    timeCommitment: 'Weekendy przez 3 tygodnie'
  },
  {
    id: 'eco-003',
    title: 'Edukacja ekologiczna w szkołach',
    description: 'Prowadzenie lekcji ekologicznych dla uczniów szkół podstawowych. Kształtowanie proekologicznych postaw młodego pokolenia.',
    organization: 'Fundacja Zielona Przyszłość',
    category: 'ecology',
    location: {
      address: 'Różne szkoły w Krakowie',
      coordinates: [19.9368, 50.0614]
    },
    date: {
      start: '2024-10-15',
      end: '2025-05-31'
    },
    requirements: ['Wiedza o ekologii', 'Umiejętności prezentacyjne', 'Kreatywność'],
    benefits: ['Edukowanie młodzieży', 'Rozwój umiejętności publicznych', 'Wpływ na przyszłość planety'],
    contactEmail: 'edukacja@zielonaprzyszlosc.org',
    maxVolunteers: 15,
    currentVolunteers: 9,
    difficulty: 'medium',
    timeCommitment: '2 godziny tygodniowo'
  },
  {
    id: 'eco-004',
    title: 'Kompostownia społeczna w Nowej Hucie',
    description: 'Prowadzenie kompostowni społecznej, edukacja mieszkańców w zakresie kompostowania odpadów organicznych.',
    organization: 'Zielona Nowa Huta',
    category: 'ecology',
    location: {
      address: 'ul. Wandy 15, 31-603 Kraków',
      coordinates: [20.0743, 50.0715]
    },
    date: {
      start: '2024-10-20',
      end: '2025-08-31'
    },
    requirements: ['Podstawowa wiedza o kompostowaniu', 'Gotowość do pracy fizycznej', 'Komunikatywność'],
    benefits: ['Praktyczna wiedza ekologiczna', 'Kontakt z mieszkańcami', 'Realny wpływ na segregację'],
    contactEmail: 'kompost@zielonanovahuta.pl',
    maxVolunteers: 8,
    currentVolunteers: 4,
    difficulty: 'easy',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'eco-005',
    title: 'Monitoring jakości powietrza',
    description: 'Pomoc w prowadzeniu mobilnych pomiarów jakości powietrza w różnych dzielnicach Krakowa. Zbieranie danych o zanieczyszczeniu.',
    organization: 'Krakowski Alarm Smogowy',
    category: 'ecology',
    location: {
      address: 'Różne lokalizacje w Krakowie',
      coordinates: [19.9368, 50.0614]
    },
    date: {
      start: '2024-11-01',
      end: '2025-03-31'
    },
    requirements: ['Dokładność', 'Znajomość obsługi prostych urządzeń', 'Mobilność'],
    benefits: ['Wiedza o jakości powietrza', 'Wkład w ochronę zdrowia', 'Doświadczenie badawcze'],
    contactEmail: 'monitoring@alarmsmogowy.pl',
    maxVolunteers: 12,
    currentVolunteers: 7,
    difficulty: 'medium',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'eco-006',
    title: 'Opieka nad pszczołami miejskimi',
    description: 'Pomoc przy miejskich pasiekach na dachach budynków. Nauka podstaw pszczelarstwa i ochrony zapylaczy.',
    organization: 'Miejskie Pszczoły Kraków',
    category: 'ecology',
    location: {
      address: 'ul. Starowiślna 28A, 31-038 Kraków',
      coordinates: [19.9434, 50.0573]
    },
    date: {
      start: '2024-10-01',
      end: '2025-09-30'
    },
    requirements: ['Brak alergii na jad pszczeli', 'Spokojny temperament', 'Chęć nauki'],
    benefits: ['Unikalna wiedza o pszczołach', 'Kontakt z naturą w mieście', 'Ochrona zapylaczy'],
    contactEmail: 'pszczoly@miejskie.krakow.pl',
    maxVolunteers: 6,
    currentVolunteers: 3,
    difficulty: 'hard',
    timeCommitment: '2 godziny tygodniowo'
  },
  {
    id: 'eco-007',
    title: 'Ogród społeczny na Kazimierzu',
    description: 'Wspólne prowadzenie ogrodu warzywnego i kwiatowego w centrum miasta. Promowanie zielonej przestrzeni miejskiej.',
    organization: 'Kazimierz w Zieleni',
    category: 'ecology',
    location: {
      address: 'ul. Mostowa 2, 31-061 Kraków',
      coordinates: [19.9462, 50.0517]
    },
    date: {
      start: '2024-10-01',
      end: '2025-10-31'
    },
    requirements: ['Miłość do roślin', 'Gotowość do pracy fizycznej', 'Regularność'],
    benefits: ['Własne warzywa i kwiaty', 'Relaks w naturze', 'Budowanie społeczności'],
    contactEmail: 'ogrod@kazimierzzieleni.org',
    maxVolunteers: 15,
    currentVolunteers: 11,
    difficulty: 'easy',
    timeCommitment: '3 godziny tygodniowo'
  },

  // Sport Opportunities
  {
    id: 'sport-001',
    title: 'Trener piłki nożnej dla dzieci',
    description: 'Prowadzenie treningów piłki nożnej dla dzieci w wieku 6-12 lat. Rozwijanie umiejętności sportowych i kształtowanie charakteru.',
    organization: 'Młodzieżowy Klub Sportowy "Orlęta"',
    category: 'sport',
    location: {
      address: 'ul. Reymonta 4, 30-059 Kraków',
      coordinates: [19.9123, 50.0678]
    },
    date: {
      start: '2024-10-01',
      end: '2025-06-30'
    },
    requirements: ['Doświadczenie w piłce nożnej', 'Komunikatywność', 'Cierpliwość z dziećmi'],
    benefits: ['Rozwój umiejętności trenerskich', 'Radość z pracy z dziećmi', 'Kształtowanie młodych talentów'],
    contactEmail: 'trening@orleta.krakow.pl',
    maxVolunteers: 6,
    currentVolunteers: 4,
    difficulty: 'medium',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'sport-002',
    title: 'Organizacja biegów charytatywnych',
    description: 'Pomoc w organizacji cotygodniowych biegów charytatywnych w Parku Jordana. Obsługa techniczna i wsparcie uczestników.',
    organization: 'Kraków Biega dla Innych',
    category: 'sport',
    location: {
      address: 'Park im. Dr. Henryka Jordana, 30-056 Kraków',
      coordinates: [19.9267, 50.0654]
    },
    date: {
      start: '2024-10-05',
      end: '2025-05-25'
    },
    requirements: ['Punktualność', 'Dobra organizacja', 'Podstawowa znajomość pierwszej pomocy'],
    benefits: ['Kontakt ze sportowcami', 'Doświadczenie organizacyjne', 'Pomoc w działalności charytatywnej'],
    contactEmail: 'biegi@krakowbiega.pl',
    maxVolunteers: 25,
    currentVolunteers: 18,
    difficulty: 'easy',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'sport-003',
    title: 'Zajęcia fitness dla seniorów',
    description: 'Prowadzenie zajęć gimnastyki i stretching dla osób starszych. Poprawa kondycji fizycznej i zdrowia seniorów.',
    organization: 'Aktywni Seniorzy Kraków',
    category: 'sport',
    location: {
      address: 'ul. Lea 128, 30-133 Kraków',
      coordinates: [19.9651, 50.0456]
    },
    date: {
      start: '2024-10-10',
      end: '2025-12-20'
    },
    requirements: ['Wykształcenie z zakresu AWF lub fizjoterapii', 'Doświadczenie z osobami starszymi', 'Empatia'],
    benefits: ['Rozwój zawodowy', 'Satysfakcja z pomagania', 'Kontakt międzypokoleniowy'],
    contactEmail: 'fitness@aktywniseniorzy.pl',
    maxVolunteers: 4,
    currentVolunteers: 2,
    difficulty: 'hard',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'sport-004',
    title: 'Zajęcia pływania dla niepełnosprawnych',
    description: 'Asystowanie przy zajęciach pływania dla osób z niepełnosprawnościami. Pomoc w rehabilitacji wodnej.',
    organization: 'Centrum Sportu Adaptacyjnego',
    category: 'sport',
    location: {
      address: 'ul. 29 Listopada 46, 31-425 Kraków',
      coordinates: [19.9523, 50.0234]
    },
    date: {
      start: '2024-11-01',
      end: '2025-08-31'
    },
    requirements: ['Umiejętność pływania', 'Doświadczenie z osobami niepełnosprawnymi', 'Kurs ratownictwa wodnego'],
    benefits: ['Specjalistyczne doświadczenie', 'Rozwój empatii', 'Pomoc w rehabilitacji'],
    contactEmail: 'plywanie@sportadaptacyjny.org',
    maxVolunteers: 8,
    currentVolunteers: 5,
    isUrgent: true,
    difficulty: 'hard',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'sport-005',
    title: 'Sędziowanie turniejów streetball',
    description: 'Sędziowanie meczów w miejskich turniejach koszykówki ulicznej. Promowanie sportu wśród młodzieży.',
    organization: 'Kraków Streetball League',
    category: 'sport',
    location: {
      address: 'Boiska przy ul. Dietla 1, 31-070 Kraków',
      coordinates: [19.9521, 50.0543]
    },
    date: {
      start: '2024-10-15',
      end: '2025-09-15'
    },
    requirements: ['Znajomość zasad koszykówki', 'Asertywność', 'Dobra kondycja fizyczna'],
    benefits: ['Rozwój umiejętności sędziowskich', 'Kontakt z młodzieżą', 'Aktywność fizyczna'],
    contactEmail: 'sedziowie@streetball.krakow.pl',
    maxVolunteers: 12,
    currentVolunteers: 8,
    difficulty: 'medium',
    timeCommitment: '2 godziny tygodniowo'
  },
  {
    id: 'sport-006',
    title: 'Organizacja spartakiad dla dzieci',
    description: 'Pomoc w organizacji zawodów sportowych dla najmłodszych. Przygotowanie stanowisk, obsługa zawodów.',
    organization: 'Sportowe Przedszkola Kraków',
    category: 'sport',
    location: {
      address: 'Różne lokalizacje w Krakowie',
      coordinates: [19.9368, 50.0614]
    },
    date: {
      start: '2024-10-20',
      end: '2025-06-15'
    },
    requirements: ['Miłość do dzieci', 'Kreatywność', 'Dobra organizacja'],
    benefits: ['Radość z pracy z dziećmi', 'Doświadczenie organizacyjne', 'Promowanie sportu'],
    contactEmail: 'spartakiady@sportprzedszkola.pl',
    maxVolunteers: 20,
    currentVolunteers: 14,
    difficulty: 'easy',
    timeCommitment: 'Weekendy raz w miesiącu'
  },
  {
    id: 'sport-007',
    title: 'Nordic walking dla wszystkich',
    description: 'Prowadzenie grupy nordic walking w Parku Krakowskim. Zajęcia otwarte dla osób w każdym wieku.',
    organization: 'Krakowski Klub Nordic Walking',
    category: 'sport',
    location: {
      address: 'Park Krakowski, al. Focha, 30-111 Kraków',
      coordinates: [19.9134, 50.0743]
    },
    date: {
      start: '2024-10-01',
      end: '2025-10-31'
    },
    requirements: ['Instruktor nordic walking', 'Dobra kondycja fizyczna', 'Komunikatywność'],
    benefits: ['Rozwój zawodowy', 'Aktywność na świeżym powietrzu', 'Budowanie społeczności'],
    contactEmail: 'nordic@klubkrakow.pl',
    maxVolunteers: 5,
    currentVolunteers: 3,
    difficulty: 'medium',
    timeCommitment: '2 godziny tygodniowo'
  },

  // Culture Opportunities
  {
    id: 'cult-001',
    title: 'Przewodnik po Starym Mieście',
    description: 'Prowadzenie bezpłatnych wycieczek po Starym Mieście w Krakowie dla turystów polskich i zagranicznych.',
    organization: 'Krakowscy Przewodnicy Wolontariusze',
    category: 'culture',
    location: {
      address: 'Rynek Główny 1-3, 31-042 Kraków',
      coordinates: [19.9370, 50.0616]
    },
    date: {
      start: '2024-10-01',
      end: '2025-09-30'
    },
    requirements: ['Znajomość historii Krakowa', 'Komunikatywność', 'Znajomość języków obcych'],
    benefits: ['Poznawanie ludzi z całego świata', 'Doskonalenie języków', 'Promowanie Krakowa'],
    contactEmail: 'przewodnicy@krakowwolontariat.pl',
    maxVolunteers: 20,
    currentVolunteers: 15,
    difficulty: 'medium',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'cult-002',
    title: 'Organizacja warsztatów ceramicznych',
    description: 'Pomoc w prowadzeniu warsztatów ceramiki dla dzieci i dorosłych. Rozwijanie umiejętności artystycznych.',
    organization: 'Dom Kultury "Podgórze"',
    category: 'culture',
    location: {
      address: 'ul. Kalwaryjska 9, 30-504 Kraków',
      coordinates: [19.9534, 50.0478]
    },
    date: {
      start: '2024-10-15',
      end: '2025-05-30'
    },
    requirements: ['Podstawowa znajomość ceramiki', 'Kreatywność', 'Cierpliwość'],
    benefits: ['Rozwój umiejętności artystycznych', 'Kontakt z kulturą', 'Satysfakcja twórcza'],
    contactEmail: 'ceramika@dkpodgorze.pl',
    maxVolunteers: 8,
    currentVolunteers: 5,
    difficulty: 'medium',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'cult-003',
    title: 'Festiwal Kultury Żydowskiej - obsługa',
    description: 'Pomoc przy organizacji największego festiwalu kultury żydowskiej w Europie. Obsługa gości, tłumaczenia, logistyka.',
    organization: 'Centrum Kultury Żydowskiej',
    category: 'culture',
    location: {
      address: 'ul. Meiselsa 17, 31-058 Kraków',
      coordinates: [19.9489, 50.0512]
    },
    date: {
      start: '2024-06-20',
      end: '2024-07-05'
    },
    requirements: ['Znajomość języków obcych', 'Komunikatywność', 'Zainteresowanie kulturą żydowską'],
    benefits: ['Uczestnictwo w wielkim wydarzeniu', 'Kontakt międzynarodowy', 'Promocja kultury'],
    contactEmail: 'festiwal@judaica.pl',
    maxVolunteers: 50,
    currentVolunteers: 32,
    isUrgent: true,
    difficulty: 'medium',
    timeCommitment: 'Pełen czas przez 2 tygodnie'
  },
  {
    id: 'cult-004',
    title: 'Teatr dla seniorów',
    description: 'Prowadzenie zajęć teatralnych dla osób starszych. Rozwijanie ekspresji i integracja społeczna seniorów.',
    organization: 'Teatr "Trzeci Wiek"',
    category: 'culture',
    location: {
      address: 'ul. Bonerowska 17, 30-673 Kraków',
      coordinates: [19.9823, 50.0434]
    },
    date: {
      start: '2024-10-01',
      end: '2025-06-30'
    },
    requirements: ['Wykształcenie teatralne lub podobne', 'Doświadczenie z seniorami', 'Kreatywność'],
    benefits: ['Rozwój zawodowy', 'Kontakt międzypokoleniowy', 'Tworzenie kultury senioralnej'],
    contactEmail: 'teatr@trzeciwiek.pl',
    maxVolunteers: 4,
    currentVolunteers: 2,
    difficulty: 'hard',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'cult-005',
    title: 'Muzeum interaktywne dla dzieci',
    description: 'Prowadzenie interaktywnych wystaw i warsztatów edukacyjnych dla najmłodszych w muzeum.',
    organization: 'Muzeum Krakowa',
    category: 'culture',
    location: {
      address: 'Rynek Główny 35, 31-011 Kraków',
      coordinates: [19.9375, 50.0618]
    },
    date: {
      start: '2024-11-01',
      end: '2025-08-31'
    },
    requirements: ['Wykształcenie pedagogiczne lub historyczne', 'Kreatywność', 'Miłość do dzieci'],
    benefits: ['Edukowanie młodego pokolenia', 'Kontakt z historią', 'Rozwój umiejętności edukacyjnych'],
    contactEmail: 'dzieci@muzeumkrakowa.pl',
    maxVolunteers: 10,
    currentVolunteers: 7,
    difficulty: 'medium',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'cult-006',
    title: 'Koncerty w hospicjum',
    description: 'Organizowanie małych koncertów i występów artystycznych dla pacjentów hospicjum i ich rodzin.',
    organization: 'Hospicjum "Caritas"',
    category: 'culture',
    location: {
      address: 'ul. Helclów 10, 31-982 Kraków',
      coordinates: [19.9645, 50.0712]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Umiejętności muzyczne lub artystyczne', 'Empatia', 'Dojrzałość emocjonalna'],
    benefits: ['Głębokie doświadczenie ludzkie', 'Niesienie pociechy', 'Rozwój duchowy'],
    contactEmail: 'koncerty@hospicjum.krakow.pl',
    maxVolunteers: 12,
    currentVolunteers: 8,
    difficulty: 'hard',
    timeCommitment: '2 godziny miesięcznie'
  },
  {
    id: 'cult-007',
    title: 'Biblioteka - opowiadanie dzieciom',
    description: 'Cotygodniowe spotkania z dziećmi w bibliotece. Czytanie książek, opowiadanie baśni i organizacja konkursów.',
    organization: 'Biblioteka Publiczna w Krakowie',
    category: 'culture',
    location: {
      address: 'ul. Rajska 1, 31-124 Kraków',
      coordinates: [19.9423, 50.0634]
    },
    date: {
      start: '2024-10-05',
      end: '2025-06-25'
    },
    requirements: ['Miłość do książek', 'Umiejętności komunikacyjne', 'Kreatywność'],
    benefits: ['Krzewienie miłości do czytania', 'Kontakt z literaturą', 'Radość dzieci'],
    contactEmail: 'dzieci@biblioteka.krakow.pl',
    maxVolunteers: 6,
    currentVolunteers: 4,
    difficulty: 'easy',
    timeCommitment: '2 godziny tygodniowo'
  },

  // Social Opportunities
  {
    id: 'soc-001',
    title: 'Wsparcie dla bezdomnych',
    description: 'Pomoc w przygotowywaniu i wydawaniu posiłków dla osób bezdomnych. Podstawowe wsparcie socjalne i rozmowy.',
    organization: 'Schronisko dla Bezdomnych "Barka"',
    category: 'social',
    location: {
      address: 'ul. Kopernika 27, 31-501 Kraków',
      coordinates: [19.9456, 50.0389]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Empatia', 'Brak uprzędzeń', 'Dyskrecja'],
    benefits: ['Pomoc najuboższym', 'Rozwój empatii', 'Zrozumienie problemów społecznych'],
    contactEmail: 'pomoc@barka.krakow.pl',
    maxVolunteers: 15,
    currentVolunteers: 10,
    isUrgent: true,
    difficulty: 'medium',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'soc-002',
    title: 'Opieka nad samotnymi seniorami',
    description: 'Regularne wizyty u samotnych osób starszych. Rozmowy, pomoc w drobnych sprawach, towarzyszenie do lekarza.',
    organization: 'Fundacja "Razem dla Seniorów"',
    category: 'social',
    location: {
      address: 'Różne adresy w Krakowie',
      coordinates: [19.9368, 50.0614]
    },
    date: {
      start: '2024-10-01',
      end: '2025-10-31'
    },
    requirements: ['Cierpliwość', 'Empatia', 'Komunikatywność', 'Dyskrecja'],
    benefits: ['Głębokie satysfakcje osobiste', 'Doświadczenia życiowe', 'Pomoc w walce z samotnością'],
    contactEmail: 'seniorzy@razem.org.pl',
    maxVolunteers: 25,
    currentVolunteers: 18,
    difficulty: 'medium',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'soc-003',
    title: 'Integracja osób niepełnosprawnych',
    description: 'Organizacja wspólnych wyjść, imprez integracyjnych i zajęć dla osób z niepełnosprawnościami.',
    organization: 'Centrum Integracji Społecznej',
    category: 'social',
    location: {
      address: 'ul. Lobzowska 5, 31-140 Kraków',
      coordinates: [19.9387, 50.0734]
    },
    date: {
      start: '2024-10-10',
      end: '2025-09-30'
    },
    requirements: ['Otwartość', 'Cierpliwość', 'Umiejętności organizacyjne'],
    benefits: ['Rozwój osobisty', 'Walka z wykluczeniem', 'Budowanie społeczeństwa otwartego'],
    contactEmail: 'integracja@cis.krakow.pl',
    maxVolunteers: 20,
    currentVolunteers: 12,
    difficulty: 'medium',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'soc-004',
    title: 'Bank Żywności - sortowanie darów',
    description: 'Pomoc w sortowaniu, pakowaniu i dystrybucji żywności dla potrzebujących rodzin w Krakowie.',
    organization: 'Krakowski Bank Żywności',
    category: 'social',
    location: {
      address: 'ul. Wielicka 259, 30-663 Kraków',
      coordinates: [19.9876, 50.0234]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Kondycja fizyczna', 'Dokładność', 'Punktualność'],
    benefits: ['Walka z marnotrawstwem żywności', 'Pomoc głodującym', 'Praca w zespole'],
    contactEmail: 'magazyn@bankzywnosci.pl',
    maxVolunteers: 30,
    currentVolunteers: 22,
    difficulty: 'easy',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'soc-005',
    title: 'Pomoc dzieciom w szpitalu',
    description: 'Organizowanie zajęć edukacyjnych i rozrywkowych dla dzieci przebywających długotrwale w szpitalu.',
    organization: 'Szpital Dziecięcy w Krakowie',
    category: 'social',
    location: {
      address: 'ul. Wielicka 265, 30-663 Kraków',
      coordinates: [19.9889, 50.0245]
    },
    date: {
      start: '2024-11-01',
      end: '2025-08-31'
    },
    requirements: ['Doświadczenie z dziećmi', 'Kreatywność', 'Badania psychologiczne', 'Szczepienia'],
    benefits: ['Niesienie radości chorym dzieciom', 'Rozwój empatii', 'Doświadczenie w trudnych sytuacjach'],
    contactEmail: 'dzieci@szpital.krakow.pl',
    maxVolunteers: 8,
    currentVolunteers: 5,
    difficulty: 'hard',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'soc-006',
    title: 'Centrum Pomocy Rodzinie',
    description: 'Wsparcie w opiece nad dziećmi z rodzin dysfunkcyjnych. Pomoc w nauce, organizacja czasu wolnego.',
    organization: 'Miejski Ośrodek Pomocy Społecznej',
    category: 'social',
    location: {
      address: 'ul. Dekerta 24, 30-703 Kraków',
      coordinates: [19.9723, 50.0423]
    },
    date: {
      start: '2024-10-15',
      end: '2025-06-30'
    },
    requirements: ['Wykształcenie pedagogiczne/psychologiczne', 'Doświadczenie z dziećmi', 'Cierpliwość'],
    benefits: ['Pomoc dzieciom w trudnej sytuacji', 'Rozwój zawodowy', 'Realne zmiany w życiu rodzin'],
    contactEmail: 'rodzina@mops.krakow.pl',
    maxVolunteers: 10,
    currentVolunteers: 6,
    difficulty: 'hard',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'soc-007',
    title: 'Wsparcie dla uchodźców',
    description: 'Pomoc w adaptacji kulturowej i językowej dla osób szukających schronienia w Polsce.',
    organization: 'Centrum Pomocy Uchodźcom',
    category: 'social',
    location: {
      address: 'ul. Krowoderska 40, 31-142 Kraków',
      coordinates: [19.9234, 50.0756]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Znajomość języków obcych', 'Otwartość kulturowa', 'Empatia'],
    benefits: ['Pomoc w trudnej sytuacji życiowej', 'Kontakt międzykulturowy', 'Budowanie mostów'],
    contactEmail: 'uchodzcy@centrum.krakow.pl',
    maxVolunteers: 15,
    currentVolunteers: 9,
    difficulty: 'medium',
    timeCommitment: '3 godziny tygodniowo'
  },

  // Health Opportunities
  {
    id: 'health-001',
    title: 'Promocja profilaktyki zdrowotnej',
    description: 'Organizowanie akcji profilaktycznych - badania ciśnienia, cukrzycy, BMI. Edukacja zdrowotna społeczności.',
    organization: 'Krakowski Urząd Miasta - Wydział Zdrowia',
    category: 'health',
    location: {
      address: 'pl. Wszystkich Świętych 3-4, 31-004 Kraków',
      coordinates: [19.9387, 50.0625]
    },
    date: {
      start: '2024-10-01',
      end: '2025-09-30'
    },
    requirements: ['Wykształcenie medyczne/pielęgniarskie', 'Komunikatywność', 'Rzetelność'],
    benefits: ['Promocja zdrowia publicznego', 'Kontakt z mieszkańcami', 'Rozwój zawodowy'],
    contactEmail: 'profilaktyka@um.krakow.pl',
    maxVolunteers: 12,
    currentVolunteers: 8,
    difficulty: 'hard',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'health-002',
    title: 'Rehabilitacja seniorów',
    description: 'Prowadzenie ćwiczeń rehabilitacyjnych dla osób starszych w domach opieki i ośrodkach dziennych.',
    organization: 'Dom Opieki "Słoneczna Jesień"',
    category: 'health',
    location: {
      address: 'ul. Opolska 17, 31-323 Kraków',
      coordinates: [19.9123, 50.0434]
    },
    date: {
      start: '2024-10-08',
      end: '2025-07-31'
    },
    requirements: ['Wykształcenie fizjoterapeutyczne', 'Doświadczenie z seniorami', 'Cierpliwość'],
    benefits: ['Pomoc w zachowaniu sprawności', 'Rozwój zawodowy', 'Kontakt międzypokoleniowy'],
    contactEmail: 'rehabilitacja@sloneczna.pl',
    maxVolunteers: 6,
    currentVolunteers: 4,
    difficulty: 'hard',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'health-003',
    title: 'Wsparcie psychologiczne online',
    description: 'Prowadzenie bezpłatnych konsultacji psychologicznych online dla młodzieży i dorosłych w kryzysie.',
    organization: 'Telefon Zaufania Kraków',
    category: 'health',
    location: {
      address: 'Praca zdalna',
      coordinates: [19.9368, 50.0614]
    },
    date: {
      start: '2024-11-01',
      end: '2025-10-31'
    },
    requirements: ['Wykształcenie psychologiczne', 'Doświadczenie terapeutyczne', 'Przeszkolenie w interwencji kryzysowej'],
    benefits: ['Pomoc w sytuacjach kryzysowych', 'Rozwój zawodowy', 'Elastyczność godzin pracy'],
    contactEmail: 'psycholog@telefon.krakow.pl',
    maxVolunteers: 8,
    currentVolunteers: 5,
    isUrgent: true,
    difficulty: 'hard',
    timeCommitment: '6 godzin tygodniowo'
  },
  {
    id: 'health-004',
    title: 'Opieka paliatywna w domu',
    description: 'Wsparcie rodzin opiekujących się chorymi w terminalnej fazie choroby. Pomoc praktyczna i emocjonalna.',
    organization: 'Hospicjum Domowe "Nadzieja"',
    category: 'health',
    location: {
      address: 'Różne adresy w Krakowie',
      coordinates: [19.9368, 50.0614]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Dojrzałość emocjonalna', 'Doświadczenie z chorymi', 'Dyskrecja'],
    benefits: ['Głębokie doświadczenia ludzkie', 'Pomoc w najtrudniejszych chwilach', 'Rozwój duchowy'],
    contactEmail: 'opieka@nadzieja.krakow.pl',
    maxVolunteers: 10,
    currentVolunteers: 7,
    difficulty: 'hard',
    timeCommitment: '4 godziny tygodniowo'
  },
  {
    id: 'health-005',
    title: 'Edukacja żywieniowa w szkołach',
    description: 'Prowadzenie warsztatów o zdrowym żywieniu dla uczniów szkół podstawowych i średnich.',
    organization: 'Fundacja Zdrowej Żywności',
    category: 'health',
    location: {
      address: 'Różne szkoły w Krakowie',
      coordinates: [19.9368, 50.0614]
    },
    date: {
      start: '2024-10-15',
      end: '2025-05-31'
    },
    requirements: ['Wykształcenie dietetyczne/medyczne', 'Umiejętności prezentacyjne', 'Kreatywność'],
    benefits: ['Edukacja młodego pokolenia', 'Promocja zdrowego stylu życia', 'Rozwój umiejętności edukacyjnych'],
    contactEmail: 'edukacja@zdrowazywnosc.org',
    maxVolunteers: 8,
    currentVolunteers: 5,
    difficulty: 'medium',
    timeCommitment: '2 godziny tygodniowo'
  },
  {
    id: 'health-006',
    title: 'Terapia zajęciowa w szpitalu psychiatrycznym',
    description: 'Prowadzenie zajęć terapeutycznych - arteterapia, muzykoterapia dla pacjentów z zaburzeniami psychicznymi.',
    organization: 'Szpital Psychiatryczny im. Józefa Babińskiego',
    category: 'health',
    location: {
      address: 'ul. Kocmyrzowska 134, 30-611 Kraków',
      coordinates: [19.9876, 50.0934]
    },
    date: {
      start: '2024-11-01',
      end: '2025-08-31'
    },
    requirements: ['Wykształcenie terapeutyczne', 'Stabilność psychiczna', 'Doświadczenie z chorymi'],
    benefits: ['Specjalistyczne doświadczenie', 'Pomoc w leczeniu', 'Rozwój zawodowy'],
    contactEmail: 'terapia@babinski.krakow.pl',
    maxVolunteers: 6,
    currentVolunteers: 3,
    difficulty: 'hard',
    timeCommitment: '3 godziny tygodniowo'
  },
  {
    id: 'health-007',
    title: 'Pierwsza pomoc - szkolenia publiczne',
    description: 'Prowadzenie bezpłatnych kursów pierwszej pomocy dla mieszkańców Krakowa w różnych dzielnicach.',
    organization: 'Polski Czerwony Krzyż - Oddział Kraków',
    category: 'health',
    location: {
      address: 'ul. Helclów 17, 31-982 Kraków',
      coordinates: [19.9634, 50.0723]
    },
    date: {
      start: '2024-10-01',
      end: '2025-09-30'
    },
    requirements: ['Kwalifikacje instruktora pierwszej pomocy', 'Doświadczenie w ratownictwie', 'Komunikatywność'],
    benefits: ['Ratowanie życia i zdrowia', 'Edukacja społeczna', 'Rozwój umiejętności instruktorskich'],
    contactEmail: 'pierwszapomoc@pck.krakow.pl',
    maxVolunteers: 10,
    currentVolunteers: 8,
    difficulty: 'hard',
    timeCommitment: '4 godziny tygodniowo'
  }
];