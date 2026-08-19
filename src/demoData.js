export const demoPackage = {
  title: 'Clouds, Canyons & Living Roots',
  subtitle: 'A 7-day family adventure across Meghalaya',
  price: '₹2,84,000',
  highlights: ['Living root bridges', 'Dawki river picnic', 'Private family vehicle', 'Curated local host'],
  assumptions: ['Flights excluded', 'Breakfast included', 'Private transfers included'],
  days: [
    { day: 1, place: 'Guwahati · Shillong', title: 'Into the clouds', description: 'Airport welcome, scenic drive to Shillong and a relaxed evening around Police Bazaar.' },
    { day: 2, place: 'Shillong', title: 'Falls, forests & flavours', description: 'Elephant Falls, Laitlum Canyon and a private Khasi food trail tailored for the children.' },
    { day: 3, place: 'Cherrapunji', title: 'Waterfall country', description: 'Drive through misty valleys to Nohkalikai Falls, Mawsmai caves and a quiet eco-resort.' },
    { day: 4, place: 'Nongriat', title: 'The living bridge', description: 'Guided trek to the Double Decker Living Root Bridge with a flexible family-friendly turnaround.' },
    { day: 5, place: 'Dawki · Mawlynnong', title: 'River of glass', description: 'Private Shnongpdeng boat ride, riverside picnic and an unhurried village walk.' },
    { day: 6, place: 'Shillong', title: 'Choose your rhythm', description: 'A slow morning followed by kayaking at Umiam or café hopping and local shopping.' },
    { day: 7, place: 'Guwahati', title: 'A beautiful way home', description: 'Sunrise by Umiam Lake and private airport transfer with assistance.' }
  ]
};

export const hotels = [
  { name: 'The Heritage Club', place: 'Shillong', type: 'Premium heritage', rating: '4.7', price: '₹11,800/night', tag: 'TLC preferred', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ri Kynjai', place: 'Umiam Lake', type: 'Luxury retreat', rating: '4.8', price: '₹16,500/night', tag: 'Best experience', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Polo Orchid Resort', place: 'Cherrapunji', type: 'Nature resort', rating: '4.5', price: '₹9,700/night', tag: 'Family favourite', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' }
];

export const experiences = [
  { icon: '🌿', title: 'Living Root Bridge', meta: 'Private guide · 5 hours', price: '₹4,800', selected: true },
  { icon: '🛶', title: 'Dawki Private Boat', meta: 'Sunrise slot · 90 min', price: '₹3,200', selected: true },
  { icon: '🥘', title: 'Khasi Table Experience', meta: 'Family-hosted lunch', price: '₹5,600', selected: true },
  { icon: '🧗', title: 'Mawmluh Caving', meta: 'Beginner · Age 12+', price: '₹6,400', selected: false }
];

export const alerts = [
  { time: '10:42', type: 'Concierge', title: 'Umbrellas arranged', text: 'Rain expected near Cherrapunji. 4 umbrellas added to your vehicle.', status: 'Done' },
  { time: '09:15', type: 'Travel smart', title: 'Drive time changed', text: 'Roadwork adds ~25 minutes to today’s route. Departure moved to 8:15 AM.', status: 'Sent' },
  { time: 'Yesterday', type: 'Request', title: 'Less spicy meal', text: 'Hotel and local host have confirmed the children’s meal preference.', status: 'Resolved' }
];
