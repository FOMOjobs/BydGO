import { VolunteerOpportunity } from '@/types/volunteer.types';

export const volunteerOpportunities: VolunteerOpportunity[] = [
  // Historia i Kryptologia
  {
    id: 'hist-001',
    title: 'Kod Enigmy',
    description: 'Znajdź ukryty kod na pomniku kryptologa Mariana Rejewskiego. Rozwiąż zagadkę związaną z maszyną szyfrującą Enigma i odkryj sekret, który zmienił bieg II wojny światowej.',
    organization: 'Muzeum Okręgowe Bydgoszczy',
    category: 'culture',
    location: {
      address: 'Ławeczka Mariana Rejewskiego, Bydgoszcz',
      coordinates: [18.0084, 53.1235]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Smartfon z GPS', 'Chęć rozwiązywania zagadek', 'Podstawowa wiedza o II wojnie światowej'],
    benefits: ['Poznanie historii kryptologii', 'Pieczątka w wirtualnym paszporcie', 'Odznaka "Szyfrant Rejewskiego"'],
    contactEmail: 'gra@bydgo.bydgoszcz.pl',
    maxVolunteers: 100,
    currentVolunteers: 23,
    imageUrl: 'https://source.unsplash.com/800x600/?museum,mystery,statue',
    isUrgent: false,
    difficulty: 'medium',
    timeCommitment: '1-2 godziny'
  },
  {
    id: 'arch-001',
    title: 'Tajemnica Spichrzy',
    description: 'Policz okna w środkowym spichrzu nad Brdą i wpisz wynik w aplikacji. Spichrze to zabytkowe magazyny zbożowe z XIX wieku - symbol handlowego znaczenia Bydgoszczy.',
    organization: 'Muzeum Okręgowe Bydgoszczy',
    category: 'culture',
    location: {
      address: 'Spichrze nad Brdą, ul. Grodzka, Bydgoszcz',
      coordinates: [18.0103, 53.1228]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Smartfon', 'Umiejętność liczenia', 'Dobry wzrok'],
    benefits: ['Poznanie architektury XIX w.', 'Pieczątka "Spichrze"', 'Historia handlu zbożowego'],
    contactEmail: 'gra@bydgo.bydgoszcz.pl',
    maxVolunteers: 100,
    currentVolunteers: 45,
    imageUrl: 'https://source.unsplash.com/800x600/?red+brick+building,warehouse',
    difficulty: 'easy',
    timeCommitment: '30 minut - 1 godzina'
  },
  {
    id: 'tech-001',
    title: 'Kanał Bydgoski',
    description: 'Odszukaj ślad starej śluzy w Muzeum Kanału Bydgoskiego. Poznaj historię jednego z najstarszych kanałów żeglugowych w Europie, który łączył Wisłę z Odrą.',
    organization: 'Muzeum Kanału Bydgoskiego',
    category: 'education',
    location: {
      address: 'Muzeum Kanału Bydgoskiego, ul. Mennica 9, Bydgoszcz',
      coordinates: [18.0167, 53.1289]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Bilet do muzeum (ulgowy dla uczniów)', 'Smartfon', 'Chęć poznawania historii techniki'],
    benefits: ['Wiedza o hydrotechnice', 'Pieczątka "Mistrz Śluz"', 'Zniżka na rejs kanałem'],
    contactEmail: 'muzeum@kanal.bydgoszcz.pl',
    maxVolunteers: 50,
    currentVolunteers: 12,
    imageUrl: 'https://source.unsplash.com/800x600/?canal,waterway,locks',
    isUrgent: true,
    difficulty: 'medium',
    timeCommitment: '2-3 godziny'
  },
  {
    id: 'nat-001',
    title: 'Bydgoska Wenecja',
    description: 'Zrób zdjęcie przy charakterystycznej kładce na Wyspie Młyńskiej. To malownicze miejsce nazywane "Bydgoską Wenecją" to jeden z najpiękniejszych zakątków miasta nad Brdą.',
    organization: 'Centrum Promocji Miasta',
    category: 'culture',
    location: {
      address: 'Wyspa Młyńska, Bydgoszcz',
      coordinates: [18.0089, 53.1241]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Smartfon z aparatem', 'Kreatywność fotograficzna'],
    benefits: ['Najlepsze zdjęcie na Instagram', 'Pieczątka "Fotograf Brdy"', 'Udział w konkursie fotograficznym'],
    contactEmail: 'fotografia@bydgo.bydgoszcz.pl',
    maxVolunteers: 200,
    currentVolunteers: 89,
    imageUrl: 'https://source.unsplash.com/800x600/?river+city,venice,footbridge',
    difficulty: 'easy',
    timeCommitment: '30 minut'
  },
  {
    id: 'mus-001',
    title: 'Opera Nova - Dźwięki Miasta',
    description: 'Odwiedź Operę Novą - unikalny gmach wybudowany nad Brdą. Znajdź plakietę pamiątkową i poznaj historię powstania tego architektonicznego cacka.',
    organization: 'Opera Nova',
    category: 'culture',
    location: {
      address: 'Opera Nova, ul. Marszałka Focha 5, Bydgoszcz',
      coordinates: [18.0056, 53.1212]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Miłość do muzyki', 'Smartfon', 'Szacunek dla kultury'],
    benefits: ['Wiedza o architekturze modernistycznej', 'Pieczątka "Meloman"', 'Zaproszenie na próbę otwartą'],
    contactEmail: 'edukacja@opera.bydgoszcz.pl',
    maxVolunteers: 80,
    currentVolunteers: 34,
    imageUrl: 'https://source.unsplash.com/800x600/?modern+architecture,opera+house',
    difficulty: 'easy',
    timeCommitment: '1 godzina'
  },
  {
    id: 'sport-001',
    title: 'Trasa Astrobalonu',
    description: 'Przebiegnij lub przejdź trasę wokół miejsca, gdzie odbył się historyczny start balonu "Polonia" w 1938 roku. Poznaj historię polskiego baloniarstwa.',
    organization: 'Bydgoskie Towarzystwo Biegowe',
    category: 'sport',
    location: {
      address: 'Park im. Kazimierza Wielkiego, Bydgoszcz',
      coordinates: [18.0145, 53.1178]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Obuwie sportowe', 'Aplikacja do śledzenia GPS', 'Dobra kondycja'],
    benefits: ['Aktywność fizyczna', 'Pieczątka "Balonowy Biegacz"', 'Zdrowy tryb życia'],
    contactEmail: 'biegi@bydgo.bydgoszcz.pl',
    maxVolunteers: 150,
    currentVolunteers: 67,
    imageUrl: 'https://source.unsplash.com/800x600/?city+park,running,jogging',
    difficulty: 'medium',
    timeCommitment: '1-2 godziny'
  },
  {
    id: 'nat-002',
    title: 'Ścieżka Edukacyjna Myślęcinek',
    description: 'Przemierz ścieżkę edukacyjną w Myślęcinku - największym parku miejskim w Polsce. Odszukaj wszystkie tablice informacyjne o przyrodzie regionu.',
    organization: 'Zarząd Zieleni Miejskiej',
    category: 'ecology',
    location: {
      address: 'Park Kulturowy Myślęcinek, Bydgoszcz',
      coordinates: [17.9823, 53.1534]
    },
    date: {
      start: '2024-04-01',
      end: '2024-10-31'
    },
    requirements: ['Wygodne obuwie', 'Woda do picia', 'Plecak na prowiant'],
    benefits: ['Kontakt z przyrodą', 'Pieczątka "Strażnik Puszczy"', 'Wiedza przyrodnicza'],
    contactEmail: 'myslecinek@zielenmiejska.bydgoszcz.pl',
    maxVolunteers: 100,
    currentVolunteers: 41,
    imageUrl: 'https://source.unsplash.com/800x600/?forest+path,green+park,trees',
    difficulty: 'medium',
    timeCommitment: '3-4 godziny'
  },
  {
    id: 'hist-002',
    title: 'Kamienice Starego Miasta',
    description: 'Znajdź 5 najstarszych kamienic na Starym Rynku i zrób zdjęcia ich charakterystycznych detali architektonicznych. Każda kryje swoją tajemnicę!',
    organization: 'Towarzystwo Miłośników Miasta',
    category: 'culture',
    location: {
      address: 'Stary Rynek, Bydgoszcz',
      coordinates: [18.0067, 53.1231]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Smartfon z aparatem', 'Oko do detali', 'Znajomość historii architektury (mile widziana)'],
    benefits: ['Wiedza o architekturze', 'Pieczątka "Detektyw Detali"', 'Album fotograficzny'],
    contactEmail: 'kamienice@tmm.bydgoszcz.pl',
    maxVolunteers: 120,
    currentVolunteers: 55,
    imageUrl: 'https://source.unsplash.com/800x600/?old+architecture,historic+buildings',
    difficulty: 'easy',
    timeCommitment: '1-2 godziny'
  },
  {
    id: 'tech-002',
    title: 'Mosty nad Brdą',
    description: 'Zlokalizuj wszystkie 7 mostów łączących brzegi Brdy w centrum miasta. Poznaj historię każdego z nich i zrób pamiątkowe zdjęcie.',
    organization: 'Zarząd Dróg Miejskich',
    category: 'education',
    location: {
      address: 'Bulwar Nadbrze, Bydgoszcz',
      coordinates: [18.0089, 53.1235]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Wygodne obuwie do chodzenia', 'Smartfon z GPS', 'Minimum 2 godziny czasu'],
    benefits: ['Wiedza o inżynierii mostowej', 'Pieczątka "Budowniczy Mostów"', 'Spacer po mieście'],
    contactEmail: 'mosty@zdm.bydgoszcz.pl',
    maxVolunteers: 80,
    currentVolunteers: 29,
    imageUrl: 'https://source.unsplash.com/800x600/?bridge,river,cityscape',
    difficulty: 'medium',
    timeCommitment: '2-3 godziny'
  },
  {
    id: 'cult-002',
    title: 'Graffiti Art Tour',
    description: 'Odkryj najciekawsze murale i street art w Bydgoszczy. Znajdź 10 murali z naszej listy, zrób zdjęcia i dowiedz się o artystach, którzy je stworzyli.',
    organization: 'Bydgoskie Centrum Kultury',
    category: 'culture',
    location: {
      address: 'Różne lokalizacje w Bydgoszczy',
      coordinates: [18.0084, 53.1235]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Smartfon', 'Kreatywne oko', 'Szacunek dla sztuki ulicznej'],
    benefits: ['Odkrywanie sztuki miejskiej', 'Pieczątka "Urban Explorer"', 'Poznanie lokalnych artystów'],
    contactEmail: 'kultura@bck.bydgoszcz.pl',
    maxVolunteers: 150,
    currentVolunteers: 72,
    imageUrl: 'https://source.unsplash.com/800x600/?street+art,graffiti,mural',
    difficulty: 'easy',
    timeCommitment: '3-4 godziny'
  },
  {
    id: 'hist-003',
    title: 'Tajemnice Bydgoskiej Katedry',
    description: 'Odwiedź Katedrę pw. św. Marcina i Mikołaja. Znajdź ukryte symbole w witrażach i poznaj legendy związane z tym gotyckim kościołem.',
    organization: 'Parafia Katedralna',
    category: 'culture',
    location: {
      address: 'Katedra Bydgoska, ul. Farna 6, Bydgoszcz',
      coordinates: [18.0073, 53.1228]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Strój stosowny do miejsca kultu', 'Ciszа i skupienie', 'Szacunek dla tradycji'],
    benefits: ['Wiedza o gotyku', 'Pieczątka "Pielgrzym Historii"', 'Spotkanie z historią'],
    contactEmail: 'katedra@archidiecezja.bydgoszcz.pl',
    maxVolunteers: 60,
    currentVolunteers: 18,
    imageUrl: 'https://source.unsplash.com/800x600/?gothic+cathedral,church+interior',
    difficulty: 'easy',
    timeCommitment: '1 godzina'
  },
  {
    id: 'eco-001',
    title: 'Zielone Płuca Miasta',
    description: 'Poznaj różnorodność roślin w Ogrodzie Botanicznym im. L. Celichowskiego. Znajdź 5 gatunków roślin z listy i naucz się ich nazw łacińskich.',
    organization: 'Ogród Botaniczny UKW',
    category: 'ecology',
    location: {
      address: 'Ogród Botaniczny, ul. Gdańska 124, Bydgoszcz',
      coordinates: [18.0234, 53.1345]
    },
    date: {
      start: '2024-04-01',
      end: '2024-10-31'
    },
    requirements: ['Bilet wstępu (ulgowy)', 'Notesik i długopis', 'Miłość do przyrody'],
    benefits: ['Wiedza botaniczna', 'Pieczątka "Młody Botanik"', 'Kontakt z naturą'],
    contactEmail: 'edukacja@ogrod.ukw.edu.pl',
    maxVolunteers: 40,
    currentVolunteers: 15,
    imageUrl: 'https://source.unsplash.com/800x600/?botanical+garden,greenhouse',
    difficulty: 'medium',
    timeCommitment: '1-2 godziny'
  },
  {
    id: 'sport-002',
    title: 'Bydgoskie Bulwary - Nordic Walking',
    description: 'Przejdź trasę nordic walking wzdłuż bulwarów nad Brdą. Pokonaj dystans 5 km i ciesz się widokami na rzekę.',
    organization: 'Klub Nordic Walking Bydgoszcz',
    category: 'sport',
    location: {
      address: 'Bulwary nad Brdą, Bydgoszcz',
      coordinates: [18.0089, 53.1241]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Kije do nordic walking', 'Wygodny strój sportowy', 'Woda'],
    benefits: ['Aktywność fizyczna', 'Pieczątka "Nordic Walker"', 'Spotkanie z innymi miłośnikami aktywności'],
    contactEmail: 'nordic@sport.bydgoszcz.pl',
    maxVolunteers: 100,
    currentVolunteers: 38,
    imageUrl: 'https://source.unsplash.com/800x600/?river+walk,waterfront,promenade',
    difficulty: 'easy',
    timeCommitment: '1-1.5 godziny'
  },
  {
    id: 'tech-003',
    title: 'Młyn Rothera',
    description: 'Odwiedź zabytkowy Młyn Rothera z XIX wieku. Poznaj historię przemysłu młynarskiego w Bydgoszczy i odkryj, jak działały historyczne młyny wodne.',
    organization: 'Muzeum Młynarstwa',
    category: 'education',
    location: {
      address: 'Młyn Rothera, ul. Mennica, Bydgoszcz',
      coordinates: [18.0098, 53.1245]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Bilet wstępu', 'Zainteresowanie techniką', 'Smartfon do robienia zdjęć'],
    benefits: ['Wiedza o przemyśle', 'Pieczątka "Młynarz"', 'Historia techniki'],
    contactEmail: 'mlyn@muzeum.bydgoszcz.pl',
    maxVolunteers: 50,
    currentVolunteers: 21,
    imageUrl: 'https://source.unsplash.com/800x600/?old+mill,watermill,heritage',
    difficulty: 'easy',
    timeCommitment: '1-2 godziny'
  },
  {
    id: 'cult-003',
    title: 'Ławeczki Znanych Bydgoszczan',
    description: 'Znajdź ławeczki poświęcone znanym postaciom związanym z Bydgoszczą: Marianowi Rejewskiemu, Leonowi Wyczółkowskiemu i innym. Zrób zdjęcie przy każdej.',
    organization: 'Urząd Miejski Bydgoszczy',
    category: 'culture',
    location: {
      address: 'Różne lokalizacje w centrum Bydgoszczy',
      coordinates: [18.0084, 53.1235]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Smartfon z GPS i aparatem', 'Dobre buty do chodzenia', 'Minimum 3 godziny czasu'],
    benefits: ['Poznanie postaci historycznych', 'Pieczątka "Tropiciel Ławeczek"', 'Spacer po mieście'],
    contactEmail: 'laweczki@um.bydgoszcz.pl',
    maxVolunteers: 200,
    currentVolunteers: 94,
    imageUrl: 'https://source.unsplash.com/800x600/?city+bench,sculpture,monument',
    difficulty: 'medium',
    timeCommitment: '3-4 godziny'
  },
  {
    id: 'hist-004',
    title: 'Bydgoski Wenecjanin',
    description: 'Poznaj postać legendarnego "Bydgoskiego Wenecjanina" - flisaka strzegącego miasta. Znajdź jego figurę i poznaj legendę.',
    organization: 'Towarzystwo Miłośników Miasta',
    category: 'culture',
    location: {
      address: 'Most Wenecki, Bydgoszcz',
      coordinates: [18.0092, 53.1239]
    },
    date: {
      start: '2024-10-01',
      end: '2025-12-31'
    },
    requirements: ['Chęć poznania legend miejskich', 'Smartfon', 'Wyobraźnia'],
    benefits: ['Poznanie lokalnych legend', 'Pieczątka "Strażnik Legendy"', 'Magiczna atmosfera'],
    contactEmail: 'legendy@tmm.bydgoszcz.pl',
    maxVolunteers: 100,
    currentVolunteers: 47,
    imageUrl: 'https://source.unsplash.com/800x600/?statue,river,legend',
    difficulty: 'easy',
    timeCommitment: '30 minut - 1 godzina'
  }
];
