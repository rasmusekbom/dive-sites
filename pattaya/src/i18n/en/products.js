// Product copy, transcribed from pattaya-dive.com (July–Aug 2026). Wording kept as the client wrote it;
// only spelling/casing was normalised (see CONTENT-NOTES.md). Keys: name, kicker (sub-title), short (card text),
// intro (paragraphs), overview, logistics, upgradesNote, prerequisites, includes — arrays are paragraphs or bullets.
module.exports = {
  // ------------------------------------------------------------------ DAY TRIPS
  'try-dive': {
    name: '1 Day Try Dive', nav: '1 Day Try Dive', kicker: 'Never dived before? Start here', short: 'Never dived before? Let our instructors take you for your first underwater experience.',
    cardTitle: 'Try Dive (1 day)', cardLead: 'Try Diving!',
    h2: 'If you have never dived before, let us show you our world',
    intro: [
      'As part of the Try diving day you will get to experience SCUBA for the first time while visiting our local reefs. You will be teamed up with one of our experienced instructors who will teach you the basic of SCUBA and never leave your side while you experience the beauty of our marine world.',
      'We have found that most people who try diving the first time, upgrade to become certified divers. During your day you will be able to experience…',
    ],
    bullets: ['Thorough dive briefings', '2 dives and a hot lunch in between', 'Swimming with marine life', 'Underwater photos', 'Small groups and new friends'],
  },
  'fun-diving': {
    name: 'Fun Diving for Certified Divers', nav: 'Fun Diving For Certified Divers', kicker: 'Finish the day better than you started', short: 'Come join us for 1 day of diving, this is suitable for all certified divers!',
    cardTitle: 'Fun Diving (2 dives)', cardLead: 'Fun Dives!',
    card3: { title: 'Fun Diving (3 dives)', lead: 'Fun Dives', short: 'Come join us for 1 day of diving, this is suitable for Advanced Divers and above', price: 3200 },
    h2: 'Finish the day better than you started',
    intro: [
      'Our team has found over the years that people just don’t get the training they deserve. Quite often when new divers come to us we find ourselves offering free advice and pointers to help all divers become more comfortable and confident. This has become a testament to our dedication to the diving community, all customers will leave better than when they arrived.',
      'Fun diving in Pattaya is simple, here is what you can expect in a day',
    ],
    bullets: ['Arrive at Bali Hai pier at 8am and board our boat', 'Complete 2 or 3 dives and have a hot lunch served during the day', 'Find unique and different types of Marine Fauna', 'Underwater photos', 'Small groups and new friends', 'Arrive back to the pier by 4:00pm'],
  },
  'snorkelling': {
    name: 'Snorkelling Day Trips', nav: 'Snorkelling Day Trips', kicker: '1 day snorkel trip', short: 'Too hungover to dive? A relaxing day on the boat visiting beautiful islands in Pattaya, at least 3 sites for snorkelling.',
    h1: 'Snorkel in Pattaya',
    h2: 'Snorkeling in Pattaya is the best!',
    intro: [
      'Scared to try SCUBA? Too hungover to dive? Just want a relaxing day on the boat visiting beautiful islands in Pattaya, Thailand? Look no further, our large boats are comfy and ready to take you to at least 3 sites for snorkelling!',
      'Snorkelling in Pattaya can be a great way to see many fish and corals. Our team is ready to serve you with:',
    ],
    bullets: ['high quality snorkelling equipment', '2 sites and a hot lunch in between', 'Swimming with marine life and corals', 'Breathtaking island views', 'Quiet dive boats not overloaded with tourists'],
  },

  // ------------------------------------------------------------------ RECREATIONAL
  'open-water-20': {
    name: 'RAID Open Water 20', nav: 'RAID Open Water 20', h1: 'Open Water Diver', kicker: 'Beginner diver program', short: 'A lifetime certification program designed for those who want to dive more often!',
    cardTitle: 'Open Water 20 (3 days)', cardLead: 'Open Water 20 Training', boxTitle: 'Open Water Course',
    intro: ['Our RAID Open Water 20 Scuba Dive Course is designed for beginners looking to explore the underwater world. You’ll learn essential skills from experienced instructors in a safe and fun environment. The program covers everything from equipment handling to dive safety, ensuring you’re fully equipped to enjoy your dives.'],
    overview: ['The RAID Open Water Course includes all necessary training, equipment, and supervision. You will receive in-water training, theory lessons, and certification upon successful completion. Join us for an unforgettable diving experience in beautiful Pattaya!', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 – Knowledge review and Pool session', 'Day 2 & 3 – We go on our large diving boats to complete 2 dives each day repeating the skills we learned in the pool'],
  },
  'explorer-30': {
    name: 'RAID Explorer 30', nav: 'Explorer 30 Advanced Course', h1: 'Advanced Scuba Course', kicker: 'RAID Explorer 30 training', short: 'Already a certified diver? Come learn advanced skills and dive to 30 meters!',
    cardTitle: 'Explorer 30 (2 days)', cardLead: 'Explorer 30 (Advanced Training)', boxTitle: 'Explorer 30 (Advanced Diver)',
    intro: ['Upgrade your dive skills and be able to visit 30m after participating in the RAID explorer 30 training program. Often referred to as the “Advance diver program” it is the second diving certificate most divers receive.'],
    overview: ['The RAID Explorer 30 program is conducted over 2 days completing 5 specialty dives. You will complete 1 deep dive, 1 buoyancy dive, and 1 navigation dive, and then be left to select 2 dives that you prefer.', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 – Complete 3 dives', 'Day 2 – Complete 2 dives', 'Plan to spend about 30 minutes at the shop at the end of the day to complete any administration.'],
  },
  'advanced-35': {
    name: 'RAID Advanced 35', nav: 'RAID Advanced 35 Dive Training', h1: 'Advanced 35m', kicker: 'The real advanced diver program', short: 'The REAL advanced diver course, dive to 35m and learn basic rescue skills!',
    cardTitle: 'Advanced 35 (3 days)', cardLead: 'Advanced 35 training', boxTitle: 'RAID Advanced 35',
    intro: ['The RAID Advanced 35 program combines all the aspects of a normal advanced training program, but introduces some basics rescue skills. Also, instead of only doing 5 dives, it combines 6 dives and certifies you to 35m!'],
    overview: ['The RAID Advanced 35 is designed for divers who are already Open water certified and have 20-30 dives. This course will challenge you to master Scuba basics while introducing you to basic rescue skills', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 – Knowledge review and Pool session', 'Day 2 & 3 – We go on our large diving boats to complete 3 dives each day repeating the skills we learned in the pool, and completing specialty dives'],
  },
  'master-rescue': {
    name: 'Master Rescue + First Aid', nav: 'Master Rescue + First Aid', h1: 'Master Rescue Diver', kicker: 'RAID Master Rescue program', short: 'Learn how you can help make the diving community a safer place!',
    cardTitle: 'Master Rescue + First Aid (4 days)', cardLead: 'Rescue Diver and First Aid', cardPrice: 18500, boxTitle: 'Master Rescue Diving Program',
    intro: ['The last step before you can begin professional training. A rescue diver makes every dive safer. Come expand your diving skills and learn how to handle everything from small daily problems to serious incident management.'],
    prerequisites: ['First aid and Oxygen administration certificate'],
    overview: ['Master rescue will take you through all the skills a diver needs to competently face many challenges and incidents a diver may encounter on every dive.', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 – Knowledge review and Pool session', 'Day 2 & 3 – We go on our large diving boats to complete 2 dives each day conducting practice and scenarios to prepare you for the real world.'],
    upgradeLabels: ['Master Rescue + First Aid & Oxygen Administration'],
  },
  'deep-40': {
    name: 'RAID Deep 40 Diver', nav: 'Deep Diver 40m', h1: 'Deep 40 Diver', kicker: 'Dive to 40m max', short: 'The MAX depth for recreational training, Deep 40 diver is a pinnacle of diver training!',
    cardTitle: 'Deep 40 Diver (2 days)', cardLead: 'Deep 40 diver', boxTitle: 'RAID Deep 40 Diver',
    intro: ['Embark on an exhilarating underwater adventure with RAID’s Deep 40 Diver Training in Pattaya, Thailand. Explore the vibrant marine ecosystem and push your limits as you descend to depths of 40 meters. This comprehensive course equips you with the skills and knowledge to safely navigate the challenges of deep diving, ensuring an unforgettable experience in one of the world’s premier diving destinations.'],
    overview: ['During the course will conduct a total of 4 dives progressing deeper and deeper each dive. Planning, gas management and communication are a huge focus of this program', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 & 2 – We go on our large diving boats to complete 2 dives each day.'],
  },
  'nitrox': {
    name: 'RAID Recreational Nitrox Diver', nav: 'RAID Recreational Nitrox Diver', h1: 'Nitrox Diver Training', kicker: 'Learn how to dive Nitrox', short: 'Includes 2 dives and can be combined with ANY training program we offer. Don’t let those NDL’s bring you up!',
    cardTitle: 'Nitrox Specialty (1 day)', cardLead: 'Nitrox Diver', boxTitle: 'Nitrox Diver Course',
    intro: ['The Nitrox training program can be complete either dry or wet. You do not need to dive nitrox to complete the course!', 'However we do recommend doing the course in combination with dives to get the full experience and understand first hand its benefits!'],
    overview: ['Nitrox will allow you to stay longer and various depths, dependant on the gas you breathe! The nitrox course will introduce you to the management of diving with different gases', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 Dry course – Knowledge review and classroom session', 'Day 1 Wet session – We go on our large diving boats to complete 2 dives and put our nitrox skills into real life practice!'],
  },
  'wreck-diver': {
    name: 'RAID Wreck Diver', nav: 'RAID Wreck Diver Training', h1: 'Wreck Diver', kicker: 'Wreck Diver Training', short: 'Learn to safely explore and navigate sunken vessels on our local shipwrecks.',
    boxTitle: 'RAID Wreck diver training',
    intro: ['Pattaya, Thailand offers an unparalleled opportunity for wreck diving enthusiasts. The Wreck Diver Specialty Training in Pattaya provides divers with the skills and knowledge to safely explore and navigate sunken vessels. This immersive training program covers essential topics such as wreck diving techniques, safety protocols, and the preservation of underwater heritage. Dive into the rich history and marine life that surrounds these captivating wrecks, and embark on an unforgettable underwater adventure in the vibrant waters of Pattaya.'],
    overview: ['After Completion you will have conducted 4 Open water dives on our local shipwrecks. During each dive you will learn essential skills on how to dive Wrecks safely, and learn how to handle emergencies.', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 & 2 – We go on our large diving boats to complete 2 dives each day mastering skills related to wreck diving.'],
  },
  'sidemount': {
    name: 'RAID Sidemount Diver', nav: 'RAID Sidemount Diver Training', navTech: 'RAID Technical Sidemount training', h1: 'Sidemount Dive', kicker: 'Learn to Dive Sidemount', short: '2 tanks are better than 1, step into the world of Sidemount diving today!',
    cardTitle: 'Sidemount training', cardLead: 'RAID Sidemount Diver', boxTitle: 'RAID Sidemount Diver',
    intro: ['The Sidemount Diver Course in Pattaya offers an exciting opportunity to explore the underwater world with a unique diving configuration. This course teaches divers how to properly set up and use sidemount gear, allowing for greater flexibility and streamlined movement underwater. Pattaya’s vibrant marine ecosystem provides the perfect backdrop for this course, with diverse dive sites featuring colorful coral reefs, shipwrecks, and abundant marine life. Divers will learn essential skills such as gas management, buoyancy control, and emergency procedures, ensuring a safe and enjoyable diving experience. The Sidemount Diver Course in Pattaya is an excellent choice for those looking to expand their diving skills and explore the underwater wonders of this popular diving destination.'],
    overview: ['Complete your sidemount diver training in 3 days with us. All equipment included in costs', 'We meet each day at our dive center at 7:45am and assemble gear and then either travel to pool or dive boats together from there!'],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 – Knowledge review, equipment setup and Pool session', 'Day 2 & 3 – We go on our large diving boats to complete 2 dives each day repeating the skills we learned in the pool.'],
  },

  // ------------------------------------------------------------------ PROFESSIONAL
  'divemaster': {
    name: 'RAID Divemaster', nav: 'Dive Master Training', h1: 'Divemaster Internship', kicker: 'Divemaster training Pattaya', short: 'Let our team teach you our ways as a new Divemaster, remember it’s always your fault.',
    cardTitle: 'Divemaster Training', cardLead: 'DIVE MASTER', boxTitle: 'RAID Divemaster Training',
    intro: ['Take your diving to the professional level with the RAID Divemaster Program at Thai Ocean Academy in Pattaya. Train alongside experienced RAID Instructor Trainers in real-world diving conditions while developing the leadership, rescue, and dive management skills needed to guide certified divers with confidence. With extensive hands-on experience, small class sizes, and a focus on safety, professionalism, and environmental stewardship, you’ll graduate ready to begin an exciting career in the dive industry—or simply become the best diver you can be. Come as a friend, leave as family.'],
    overview: [
      'The RAID Divemaster Program is the first step toward becoming a dive professional. Designed for experienced divers who are passionate about the underwater world, this course develops the knowledge, skills, and confidence required to supervise certified divers, assist with diver training, and support dive operations.',
      'At Thai Ocean Academy in Pattaya, you’ll gain extensive practical experience through real dive operations, leadership training, rescue skill refinement, dive planning, risk management, and environmental awareness. Working closely with our experienced RAID Instructor Trainers, you’ll build the professionalism and confidence needed to work in the global diving industry while embracing our commitment to safe, responsible, and environmentally conscious diving.',
      'Whether your goal is to start a career as a dive professional or prepare for the RAID Instructor Program, the RAID Divemaster course provides the perfect foundation.',
    ],
    logistics: ['Each day we will meet at the dive center at 7:30am. During your internship you will have varying levels of responsibility and courses to undertake each day. The divemaster internship includes unlimited diving during your stay for up to 6 months'],
    optionsTitle: 'Course Options',
    options: [['Fast Course – 3 weeks', 45000], ['Essentials – 6 weeks', 85000], ['Internship – including accommodation (3 months) and unlimited diving for 1 year', 95000]],
  },
  'instructor-training': {
    name: 'RAID Instructor Training Program', nav: 'RAID Instructor Training Program', h1: 'Scuba Instructor Training', kicker: 'Pattaya Instructor training program', short: 'Ready to give up that day job? Become a broke but very happy Diving Instructor today',
    cardTitle: 'Instructor Training Program', cardLead: 'RAID ITP', boxTitle: 'RAID Instructor Training Program',
    intro: ['Turn your passion for diving into a rewarding career with the RAID Instructor Training Program at Thai Ocean Academy in Pattaya. Learn from experienced RAID Instructor Trainers as you develop the teaching, leadership, and mentoring skills needed to inspire the next generation of divers. With comprehensive, hands-on training, small class sizes, and a strong focus on safety, excellence, and marine conservation, you’ll graduate ready to teach with confidence anywhere in the world. Come as a friend, leave as family.'],
    overview: [
      'Transform your diving experience into a professional teaching career with the 14-day RAID Instructor Training Program at Thai Ocean Academy in Pattaya. Designed for aspiring dive professionals, this comprehensive program prepares you to become a confident, knowledgeable, and highly skilled RAID Open Water 20 Instructor.',
      'Throughout the course, you’ll develop the teaching techniques, leadership skills, and dive theory required to deliver exceptional diver training. Training includes classroom presentations, confined water workshops, open water teaching scenarios, rescue skill evaluations, dive theory reviews, risk management, student assessment, and real-world instructor preparation. You’ll receive daily coaching and constructive feedback from experienced RAID Instructor Trainers, ensuring you meet—and exceed—the high standards expected of a RAID professional.',
    ],
    logistics: [
      'The RAID Instructor Training Program is conducted over 14 consecutive days, followed by the 2-day RAID Instructor Examination (IE). Training is based at Thai Ocean Academy in Pattaya and combines classroom sessions, confined water workshops, open water training, and daily teaching practice.',
      { h: 'Typical Training Schedule', ul: ['Duration: 14-day Instructor Training Program + 2-day Instructor Examination', 'Location: Thai Ocean Academy, Pattaya, Thailand', 'Daily Schedule: Approximately 8:30 AM – 5:30 PM (times may vary depending on training activities and weather conditions)', 'Training Environment: Classroom, swimming pool, dive boat, and open water'] },
      { h: 'Accommodation & Transport', p: ['Accommodation is available in Pattaya at a range of budgets, and our team is happy to assist with recommendations. Airport transfers and transport from Bangkok can also be arranged upon request.'] },
      { h: 'Additional Information', p: ['The program is intensive and requires full attendance throughout the 14-day training period. Candidates should arrive well-rested and prepared to participate in classroom sessions, water training, workshops, and self-study each day. Our small class sizes ensure plenty of individual coaching and personalized feedback, giving every candidate the best opportunity to succeed in the Instructor Examination.'] },
    ],
    upgradesText: [['Additional Instructor Specialties', '2 days for each', '6500 per specialty'], ['Accommodation for 20 days', '', '10,000 THB']],
  },
  'instructor-crossover': {
    name: 'RAID Instructor Crossover', nav: 'RAID Instructor Crossover', h1: 'Scuba Instructor Crossover', kicker: 'RAID Scuba Instructor Crossover program', short: 'Already an Instructor? Cross over to RAID and join a modern, dive-first agency.',
    boxTitle: 'RAID Instructor Crossover',
    lead: 'Already an Instructor? Cross Over to RAID.',
    intro: ['Take your professional teaching career to the next level with the RAID Instructor Crossover. This program seamlessly transitions certified instructors from other training agencies into the RAID framework. Master our tech-forward digital platform, master-level neutral buoyancy training, and flexible teaching tools designed for today’s dive professional.', 'Upgrade your rating, expand your capabilities, and join a modern, dive-first agency.'],
    overview: ['The RAID Instructor Crossover includes all required digital materials, academic orientation, and practical evaluation sessions under direct Instructor Trainer supervision.', 'You will cover RAID’s administrative procedures, high-performance teaching standards, and digital platform integration, culminating in your RAID Instructor certification upon successful completion.', 'Join us to elevate your instructional career right here in Pattaya!'],
    logistics: [
      { h: 'Pre-Course Preparation', p: ['Prior to Day 1, candidates complete all assigned online theory modules, standards quizzes, and administrative paperwork on the RAID digital portal.'] },
      'Day 1 — Classroom & RAID System Orientation: Focus on RAID standards, digital platform mastery, and academic teaching presentations.',
      'Day 2 — Theory, Pool Evaluation & Simulated Certifications: Classroom methodology followed by pool sessions covering demonstration-quality skills, simulated student teaching scenarios, and final digital certification sign-off.',
    ],
    prerequisitesRich: [
      'RAID instructors are required to have the NITROX and DEEP 40 instructor ratings.', 'Should you not hold them we offer them as add-ons',
      { h: 'Safety & First Aid Qualifications:', ul: ['Current First Aid / CPR / BLS Certification.', 'Current Oxygen Provider / Emergency O2 Instructor certification.'] },
      { h: 'Core Specialty Prerequisites (Recreational):', links: [['instructor-specialty', 'Nitrox Instructor', '7,500 THB (enquire for promotions)'], ['instructor-specialty', 'Deep 40 Instructor', '10,500 THB (enquire for promotions)']] },
    ],
    upgradeLabels: ['Xover + First Aid and O2 update'],
  },
  'instructor-specialty': {
    name: 'RAID Instructor Specialty Rating', nav: 'Instructor Specialty Training', h1: 'Instructor Specialty Training', kicker: 'Specialty Instructor rating', short: 'Let’s get some specialties to make us feel good and be more versatile!',
    cardTitle: 'Instructor Specialty Training', cardLead: 'Instructor Specialty Training', boxTitle: 'RAID Instructor Specialty Rating',
    intro: ['Take your teaching career even further with the RAID Instructor Specialty Training Program at Thai Ocean Academy in Pattaya. Expand your knowledge, develop new teaching skills, and gain the qualifications to teach a wider range of specialty diving courses. Whether you’re interested in technical skills, conservation, wreck diving, or advanced recreational training, our experienced Instructor Trainers will prepare you to confidently deliver engaging, safe, and professional specialty courses. Grow your expertise, increase your career opportunities, and become the instructor divers choose to continue their underwater journey with. Come as a friend, leave as family.'],
    overview: [
      'Our Instructor Specialty Training Program offers a wide range of certifications, including:',
      { ul: ['Nitrox (Enriched Air) Instructor', 'Deep 40 Instructor', 'Navigation Instructor', 'Dry Suit Instructor', 'Night & Limited Visibility Instructor', 'Search & Recovery Instructor', 'Equipment Specialist Instructor', 'Perfect Buoyancy Instructor', 'Boat Diver Instructor', 'Wreck Diver Instructor', 'Sidemount Instructor', 'Twinset Instructor', 'Gas Blender Instructor', 'Adaptive Diver Instructor*', 'Marine Ecology & Conservation Instructor'] },
      '*Some specialty instructor programs have additional prerequisites, experience requirements, or professional-level certifications before enrollment. Contact Thai Ocean Academy for the latest availability and entry requirements.',
    ],
    logistics: ['Prior to day 1 students will have some online theory to complete', 'Day 1 – Knowledge review and Pool session', 'Day 2 & 3 – We go on our large diving boats to complete 2 dives each day repeating the skills we learned in the pool'],
    upgradesText: [['2 specialties', '', 'Save 2000 THB'], ['3 specialties', '', 'Save 4000 THB']],
  },

  // ------------------------------------------------------------------ TECHNICAL
  'nitrox-plus': {
    name: 'RAID Nitrox+', nav: 'Nitrox Plus Decompression Training (40m)', h1: 'Basic Decompression', kicker: 'Beginner Decompression', short: 'The bridge between recreational and technical diving: planned decompression to 40 m with a single bottom gas and a bailout cylinder.',
    boxTitle: 'RAID Nitrox+ Training',
    intro: ['Take your first step into the world of technical diving with the RAID Nitrox+ Program at Thai Ocean Academy in Pattaya. Designed as the bridge between recreational and technical diving, Nitrox+ introduces divers to planned decompression diving using a single bottom gas and a dedicated bailout cylinder. You’ll develop the skills, confidence, and mindset required for technical diving while learning advanced buoyancy, gas management, emergency procedures, and decompression planning in a controlled, performance-based training environment.'],
    overview: [
      'The RAID Nitrox+ Program is the ideal transition from advanced recreational diving into technical diving. Rather than focusing solely on breathing gases, this course introduces divers to the principles, procedures, and discipline required to safely conduct limited planned decompression dives.',
      'During the program, you’ll learn how to safely plan and execute dives to 40 metres, incorporating a maximum of 10 minutes of planned decompression while using a single bottom gas and a dedicated bailout cylinder. The emphasis is on developing sound decision-making, precise buoyancy control, effective teamwork, emergency preparedness, and disciplined dive planning—all essential skills for future technical divers.',
      'Throughout the course, you’ll refine your underwater skills to a much higher standard than traditional recreational diving. Precision trim, propulsion techniques, long-hose gas sharing, bailout cylinder management, SMB deployment, emergency procedures, and decompression awareness become second nature through repetitive, performance-based training.',
      'At Thai Ocean Academy, we believe technical diving is about developing capable divers—not simply collecting certifications. Our small class sizes allow instructors to coach each diver individually, ensuring every skill is mastered before progressing to more advanced technical programs.',
      'The RAID Nitrox+ Program is also the perfect preparation for the RAID Decompression, Twinset, Sidemount, and Trimix pathways. By building a strong technical foundation from the very beginning, you’ll gain the confidence and competence needed to safely explore deeper dive sites and more challenging environments.',
      'Whether your goal is to progress into technical diving or simply become a more skilled, disciplined, and self-reliant diver, the RAID Nitrox+ Program is where your technical journey begins.',
    ],
    logistics: [
      'The RAID Nitrox+ Program is conducted over 3 days, combining academic learning, confined water skill development, and open water technical training dives. The course is structured to progressively build the skills and confidence required for planned decompression diving, with each day building upon the previous one.',
      { h: 'Day 1 – Confined Water Skills', p: ['Training begins in a swimming pool or confined water environment where you’ll become familiar with your technical equipment configuration and develop the core skills required for technical diving in a controlled setting. Skills include:'], ul: ['Equipment configuration and setup', 'Pre-dive safety checks', 'Buoyancy and trim refinement', 'Propulsion techniques', 'Valve shutdown and regulator recovery drills', 'Long-hose gas donation procedures', 'Bailout cylinder management', 'SMB deployment', 'Team communication and emergency procedures'] },
      { h: 'Day 2 – Open Water Training', p: ['The second day moves into the open water, where you’ll apply the skills developed in confined water while introducing decompression procedures. Under the close supervision of your instructor, you’ll complete progressively challenging dives focusing on:'], ul: ['Technical dive planning', 'Gas management', 'Team diving procedures', 'Controlled descents and ascents', 'Simulated emergency scenarios', 'Planned decompression stops', 'Maintaining precise buoyancy and trim throughout the dive'] },
      { h: 'Day 3 – Advanced Open Water Training', p: ['On the final day, you’ll consolidate your skills through additional technical training dives that place greater emphasis on efficiency, situational awareness, and confidence. By the end of the course, you’ll be able to safely conduct limited planned decompression dives using the procedures taught throughout the program'] },
    ],
  },
  'tdi-andp': {
    name: 'TDI ANDP', nav: 'TDI ANDP (45m)', h1: 'TDI ANDP Training', kicker: 'Advanced Nitrox Diving Procedures', short: 'TDI Advanced Nitrox & Decompression Procedures: staged decompression dives using accelerated decompression techniques.',
    boxTitle: 'TDI ANDP Training',
    intro: ['Take the next step in your technical diving journey with the TDI Advanced Nitrox & Decompression Procedures (ANDP) course at Thai Ocean Academy in Pattaya. This comprehensive program equips divers with the knowledge and practical skills to safely conduct staged decompression dives using accelerated decompression techniques. Through intensive classroom sessions, confined water training, and open water dives, you’ll master advanced equipment configurations, gas management, decompression planning, and emergency procedures, building the confidence needed to explore beyond recreational limits.'],
    overview: [
      'The TDI Advanced Nitrox & Decompression Procedures (ANDP) course is widely regarded as the foundation of modern technical diving. Combining the Advanced Nitrox and Decompression Procedures curricula into a single integrated program, this course prepares divers to safely plan and conduct staged decompression dives while using enriched air nitrox mixtures for both bottom gas and accelerated decompression.',
      'Throughout the program, you’ll learn how to configure and use technical diving equipment, manage multiple cylinders, plan decompression profiles, and conduct dives with precision and discipline. A strong emphasis is placed on buoyancy control, trim, propulsion techniques, teamwork, situational awareness, and emergency management, ensuring every diver develops the confidence and competence expected of a technical diver.',
      'At Thai Ocean Academy, training is performance-based and conducted in small groups, allowing our experienced technical instructors to provide individual coaching throughout every stage of the course. By the end of the program, you’ll have developed the skills required to safely execute staged decompression dives and be well prepared for advanced technical courses, including Trimix, Cave, and Advanced Wreck Diver training.',
      'Whether your goal is deeper wreck exploration, extended bottom times, or progressing into the world of mixed gas diving, the TDI ANDP course provides the essential technical foundation',
    ],
    logistics: [
      'The TDI Advanced Nitrox & Decompression Procedures course is conducted over 5 days, combining classroom academics, confined water training, and progressively challenging open water technical dives.',
      { h: 'Day 1 – Academic & Confined Water Training', p: ['The course begins with classroom sessions covering decompression theory, gas management, equipment configuration, and dive planning. The afternoon is spent in a pool or confined water environment where students become proficient with their technical equipment and refine essential skills before entering open water.', 'Skills include:'], ul: ['Equipment configuration and streamlining', 'Buoyancy, trim and propulsion refinement', 'Valve shutdown procedures', 'Long hose gas donation', 'Stage/decompression cylinder handling', 'Gas switching procedures', 'SMB deployment', 'Emergency drills', 'Team communication'] },
      { h: 'Days 2–5 – Open Water Technical Diving', p: ['Over four days, students complete progressively demanding technical dives, applying classroom knowledge while developing confidence in real diving conditions.', 'Training focuses on:'], ul: ['Technical dive planning', 'Decompression execution', 'Accelerated decompression using nitrox', 'Multiple gas management', 'Team diving procedures', 'Task loading and situational awareness', 'Emergency scenarios and problem solving', 'Dive analysis and post-dive debriefing'], after: ['Each dive builds upon the previous one, allowing students to refine their skills while gradually increasing the complexity of decompression dives.'] },
    ],
  },
  'decompression-diver': {
    name: 'RAID Decompression Diver', nav: 'RAID Full Decompression Diver (45m)', h1: 'Decompression Diver Training', kicker: 'Decompression diver to 45m', short: 'Staged decompression dives with extended decompression obligations, building on Nitrox+.',
    boxTitle: 'RAID Full Decompression Diver training',
    intro: ['Expand your technical diving capabilities with the RAID Decompression Diver program at Thai Ocean Academy in Pattaya. Building on the skills introduced in Nitrox+, this course develops the knowledge, discipline, and confidence required to safely conduct staged decompression dives with extended decompression obligations. Through performance-based training, you’ll refine your buoyancy, teamwork, gas management, and decompression procedures while preparing for more advanced technical diving adventures.'],
    overview: [
      'The RAID Decompression Diver program is the next step in RAID’s technical diving pathway, designed for divers who are ready to progress beyond the introductory Nitrox+ program. This course develops the planning, procedures, and mindset required to safely conduct staged decompression dives while increasing both dive complexity and diver capability.',
      'Throughout the program, you’ll build on your existing technical diving skills by refining precision buoyancy, trim, propulsion techniques, gas management, emergency procedures, and team communication. You’ll learn how to safely plan and execute decompression dives using dedicated decompression gases, manage increased task loading, and respond effectively to equipment failures and emergency scenarios.',
      'Training places a strong emphasis on developing consistency and discipline. Every dive is carefully planned, executed, and debriefed, allowing you to build confidence through repetition and performance-based learning rather than simply accumulating dive time.',
      'At Thai Ocean Academy, our experienced RAID Technical Instructors provide individual coaching in small class sizes, ensuring every diver develops the competence required to safely progress into deeper and more advanced technical diving programs.',
      'Whether your goal is exploring deeper wrecks, extending bottom time, or continuing towards Advanced Decompression and Trimix training, the RAID Decompression Diver program provides the essential foundation for your technical diving future.',
    ],
    logistics: [
      { h: 'Day 1 – Academic Review & Skills Development', p: ['The course begins with theory sessions covering decompression planning, gas management, dive execution, emergency procedures, and equipment configuration. Students then complete confined water or shallow open water skills to refine the fundamental techniques expected of a RAID technical diver.', 'Training includes:'], ul: ['Equipment configuration review', 'Team procedures and communication', 'Buoyancy and trim refinement', 'Advanced propulsion techniques', 'Gas sharing and emergency drills', 'Stage/decompression cylinder management', 'Gas switch procedures', 'SMB deployment and ascent control'] },
      { h: 'Days 2 & 3 – Open Water Technical Diving', p: ['Students complete a series of progressively more demanding decompression dives designed to reinforce safe technical diving practices while increasing confidence and efficiency.', 'Training focuses on:'], ul: ['Technical dive planning', 'Gas management and verification', 'Staged decompression procedures', 'Team awareness and communication', 'Precision buoyancy throughout decompression stops', 'Emergency management and contingency planning', 'Dive reviews and performance debriefs'], after: ['Each dive builds upon the previous one, ensuring students demonstrate competence before progressing to more complex decompression profiles.'] },
    ],
    includes: ['3 days of professional instruction', 'RAID online academic learning', 'Classroom workshops', 'Equipment configuration review', 'Confined water or shallow skills session', 'Open water technical training dives', 'Individual coaching and performance evaluations', 'RAID Decompression Diver certification upon successful completion'],
  },
  'advanced-decompression': {
    name: 'RAID Advanced Decompression Diver', nav: 'RAID Advanced Decompression Diver (50m)', h1: 'Advanced Deco Diver', kicker: 'Decompression training to 50m', short: 'Expand your depth range to 50 metres with optimized decompression using up to two decompression gases.',
    boxTitle: 'RAID Advanced Decompression Diver',
    intro: ['Push your technical diving skills to the next level with the RAID Advanced Decompression Diver program at Thai Ocean Academy in Pattaya. Designed for experienced technical divers, this course expands your depth range to 50 metres (165 feet) while introducing optimized decompression using up to two decompression gases. Through rigorous, performance-based training, you’ll develop the precision, confidence, and discipline required to safely conduct more demanding decompression dives and prepare for advanced Trimix training. The course also offers a trimix certification option for divers meeting the required prerequisites.'],
    overview: [
      'The RAID Advanced Decompression Diver program is the next progression in RAID’s technical diving pathway, building on the skills developed during the RAID Decompression Diver course. This program is designed for divers who are ready to undertake deeper dives, more complex decompression schedules, and optimized decompression procedures using multiple decompression gases.',
      'Training develops the knowledge and practical skills required to safely conduct decompression dives to 50 metres (165 feet) while managing increased task loading and greater decompression obligations. Divers refine every aspect of their technical diving, including equipment configuration, gas management, buoyancy control, propulsion techniques, emergency procedures, decompression planning, and team awareness.',
      'A major focus of the course is efficiency. You’ll learn to streamline your diving procedures, conduct precise gas switches, maintain stable decompression stops, and execute complex dives with confidence and consistency. Every dive is thoroughly planned, carefully executed, and professionally debriefed to reinforce sound decision-making and continuous improvement.',
      'At Thai Ocean Academy, we believe technical diving is built on mastery rather than minimum standards. Our small class sizes allow our instructors to provide individual coaching throughout the course, ensuring every diver develops the confidence and competence required for deeper exploration.',
      'Successful completion of the RAID Advanced Decompression Diver program prepares you for more demanding technical environments and provides the foundation for progressing to RAID Extended Decompression and RAID Normoxic Trimix training.',
    ],
    logistics: [
      { h: 'Day 1 – Theory & Confined Water Skills', p: ['The course begins with an in-depth review of decompression theory, dive planning, gas management, and equipment configuration before moving into confined water to refine core technical skills.', 'Training includes:'], ul: ['Equipment setup and configuration', 'Advanced buoyancy and trim', 'Precision propulsion techniques', 'Stage cylinder handling', 'Gas switch procedures', 'Long hose gas donation', 'Valve shutdown drills', 'SMB deployment', 'Emergency procedures and team communication'] },
      { h: 'Days 2–4 – Open Water Technical Diving', p: ['Over three days of open water diving, you’ll complete progressively more challenging decompression dives while developing confidence in deeper technical environments.', 'Training focuses on:'], ul: ['Advanced decompression planning', 'Optimized decompression using up to two decompression gases', 'Precise gas switching procedures', 'Technical dive execution', 'Team diving and communication', 'Emergency management', 'Equipment problem solving', 'Dive analysis and instructor debriefing'], after: ['Each dive increases in complexity while maintaining a strong emphasis on precision, control, and disciplined execution.'] },
    ],
    includes: ['4 days of professional instruction', 'RAID online academic learning', 'Classroom theory sessions', 'Confined water skills workshop', 'Four open water technical training dives (minimum), with at least three hours of underwater training as required by RAID standards', 'Individual coaching and performance evaluations', 'RAID Advanced Decompression Diver certification upon successful completion'],
  },
  'normoxic-decompression': {
    name: 'RAID Normoxic Decompression Diver', nav: 'RAID Normoxic Decompression Diver (60m)', h1: 'Deco 60 Normoxic Training', kicker: 'Normoxic decompression diver', short: 'Optimized decompression dives to 60 metres using air, nitrox, oxygen and trimix with up to three decompression gases.',
    boxTitle: 'RAID Normoxic Decompression Diver',
    intro: ['Reach the pinnacle of RAID open-circuit normoxic technical diving with the RAID Normoxic Decompression Diver program at Thai Ocean Academy in Pattaya. This advanced course prepares experienced technical divers to safely conduct optimized decompression dives to 60 metres (200 feet) using air, nitrox, oxygen, and trimix with up to three decompression gases. Through intensive performance-based training, you’ll refine every aspect of your technical diving while building the confidence and discipline required for deep exploration and expedition-level diving.'],
    overview: [
      'The RAID Normoxic Decompression Diver program represents the highest level of RAID’s normoxic open-circuit technical diving pathway before progressing to hypoxic trimix. Designed for experienced decompression divers, this course develops the skills, knowledge, and mindset required to safely conduct complex decompression dives to a maximum depth of 60 metres (200 feet).',
      'Building on the foundations established during Advanced and Extended Decompression training, you’ll learn to plan and execute dives using air, nitrox, oxygen, and normoxic trimix, with decompression optimized through the use of up to three decompression gases. RAID standards require trimix to be planned with an Equivalent Narcotic Depth (END/EAD) not exceeding 30 metres (100 feet), ensuring greater clarity, reduced narcosis, and improved diver performance during deep dives.',
      'Throughout the course, you’ll further refine advanced buoyancy control, trim, propulsion techniques, gas management, emergency procedures, decompression discipline, and team communication. Every dive is carefully planned, thoroughly briefed, and professionally debriefed, allowing you to build confidence through structured, performance-based learning.',
      'At Thai Ocean Academy, our experienced RAID Technical Instructors focus on producing competent technical divers—not simply issuing certifications. With small class sizes and individual coaching, every student is challenged to achieve a consistently high standard of precision, awareness, and decision-making before progressing.',
      'Whether your goal is exploring deep wrecks, participating in expedition diving, or preparing for RAID Hypoxic Trimix training, the Normoxic Decompression Diver program provides the knowledge and practical experience required to safely undertake advanced technical dives',
    ],
    logistics: [
      { h: 'Day 1 – Theory & Confined Water Skills', p: ['Training begins with an in-depth review of advanced decompression theory, trimix planning, gas management, equipment configuration, and emergency procedures before moving into confined water to refine core technical skills.', 'Skills include:'], ul: ['Equipment configuration and streamlining', 'Precision buoyancy and trim', 'Advanced propulsion techniques', 'Long hose gas donation', 'Valve shutdown procedures', 'Stage cylinder management', 'Gas switch protocols', 'SMB deployment', 'Team communication and emergency procedures'] },
      { h: 'Days 2–5 – Open Water Technical Diving', p: ['Over four days of open water training, you’ll complete progressively more demanding technical dives while refining every aspect of deep decompression diving.', 'Training focuses on:'], ul: ['Multi-gas decompression planning', 'Normoxic trimix dive planning', 'Management of up to three decompression gases', 'Precise gas switching procedures', 'Team diving and communication', 'Equipment failure management', 'Decompression execution', 'Rescue procedures', 'Dive analysis and instructor debriefing'], after: ['RAID standards require a minimum of five open water dives, with at least two dives deeper than 45 metres (145 feet) and one dive deeper than 50 metres (165 feet).'] },
    ],
  },

  // ------------------------------------------------------------------ MARINE EDUCATION
  'marine-education-eca': {
    name: 'Marine Education ECA', nav: 'Marine Education Extra Curricular Activity', h1: 'Marine Education', kicker: 'Extra curricular activity', short: 'After-school marine science programs for schools in Thailand, delivered by our Marine Biologists.',
    boxTitle: 'Marine Education ECA by Thai Ocean Academy', priceText: 'Inquire for costs',
    intro: ['Inspire the next generation of ocean stewards with Thai Ocean Academy’s Marine Education ECA Program. Delivered by experienced Marine Biologists, our engaging after-school programs combine hands-on science, conservation, and marine exploration to bring the ocean into the classroom. Every program is custom tailored to each school’s educational goals, student age groups, and curriculum, creating meaningful learning experiences that foster environmental awareness, critical thinking, and a lifelong passion for protecting our oceans. From interactive classroom workshops to real-world field experiences, we help students Educate. Equip. Explore.'],
    overview: [
      'The Thai Ocean Academy Marine Education ECA Program is an engaging, hands-on learning experience designed for students aged 8 to 18 years. Led by experienced Marine Biologists, the program introduces students to the fascinating world beneath the surface while inspiring a lifelong appreciation for our oceans and the importance of marine conservation.',
      'Every ECA program is custom designed to meet the individual goals of each school, complementing existing curricula and adapting to different age groups and learning outcomes. Lessons combine interactive classroom activities, practical experiments, scientific inquiry, and real-world conservation projects to create an exciting and meaningful educational experience.',
      'As students progress through the program, they explore an increasingly diverse range of marine science topics. Younger students build a strong foundation by learning about ocean habitats, marine animals, food webs, biodiversity, pollution, and simple conservation actions. Older students advance into more complex subjects including marine ecology, coral reef ecosystems, shark and ray biology, oceanography, climate change, marine research methods, citizen science, habitat restoration, and human impacts on the marine environment.',
      'For schools looking to provide additional experiential learning opportunities, the program can also include swimming pool activities, snorkeling, scuba diving, marine field trips, and citizen science expeditions, allowing students to apply their classroom knowledge in real-world environments under the guidance of our marine biologists and professional dive educators.',
      'Whether students dream of becoming marine scientists, conservationists, divers, or simply want to better understand the world’s oceans, our Marine Education ECA Program encourages curiosity, critical thinking, environmental responsibility, and a genuine connection with the marine world—helping every student to Educate. Equip. Explore',
    ],
    logistics: ['Although our schedule is already quite full for our ECA opportunities, most programs are taught for 1-2 hours per day up to 2 days per week at individual schools.'],
    upgradesNote: 'All of our ECA programs are designed to fit flawlessly into real world diving experiences which can be combined with the ECA.',
  },
  'citizen-science': {
    name: 'Citizen Science Programs', nav: 'Citizen Scientist in Thailand', h1: 'Marine Scientist Program', kicker: 'Marine science internships', short: 'Work alongside our Marine Biologists on genuine research and conservation projects in the Eastern Gulf of Thailand.',
    boxTitle: 'Citizen Science Programs', priceText: 'Contact for Pricing',
    intro: [
      'Go beyond recreational diving and become an active contributor to marine conservation through Thai Ocean Academy’s Marine Internship & Citizen Science Program. Designed for aspiring marine biologists, university students, conservation divers, and passionate ocean advocates, this immersive program provides the opportunity to work alongside our Marine Biologists on genuine research and conservation projects taking place in the waters of Pattaya and the Eastern Gulf of Thailand.',
      'Unlike volunteer tourism, our internships focus on collecting meaningful scientific data that supports long-term monitoring, habitat restoration, and marine conservation initiatives. Participants gain practical field experience while learning internationally recognised research methods, underwater survey techniques, data management, and scientific communication.',
    ],
    overview: [
      'Participants may become involved in a variety of ongoing projects, including:',
      { ul: [
        'Conservation Diver Program – Develop practical conservation diving skills while participating in underwater monitoring, species identification, marine debris surveys, habitat assessments, and citizen science initiatives.',
        'Neptune’s Cup Sponge Survey & Ecological Monitoring – Assist with the monitoring of the rare Neptune’s Cup Sponge (Cliona patera), recording growth rates, health assessments, recruitment, and associated marine life to better understand the ecological importance of this remarkable species.',
        'MARsci Ghost Net Removal Protocol – Learn and apply safe, scientific methods for locating, documenting, and removing abandoned fishing gear while collecting valuable environmental data to support marine conservation efforts.',
        'Artificial Reef Development, Monitoring & Maintenance – Participate in the design, deployment, monitoring, and long-term maintenance of artificial reef structures that promote biodiversity, habitat creation, and reef restoration.',
        'Research Methods & Scientific Data Collection – Learn underwater survey techniques, environmental monitoring, species identification, photographic documentation, GPS mapping, and data recording using recognized scientific protocols.',
        'Research Paper Writing & Scientific Communication – Gain experience analyzing data, interpreting results, producing scientific reports, and contributing towards research papers, conservation publications, and educational resources.',
      ] },
      'Throughout the internship, participants work as part of an active research team, developing skills in critical thinking, scientific methodology, teamwork, leadership, and environmental stewardship. Whether you’re preparing for a career in marine science, conservation, environmental management, or simply want to make a meaningful contribution to ocean protection, our Marine Internship & Citizen Science Program provides an unparalleled opportunity to gain real-world experience while helping protect Thailand’s marine ecosystems.',
      'At Thai Ocean Academy, we believe conservation begins with education, grows through research, and succeeds through collaboration. Together we Educate. Equip. Explore.',
    ],
    logistics: ['All of our programs can be completed stand alone or as a long term training program. Please contact us and our team will develop a custom program that meets your goals.'],
    upgradesNote: 'Long term accommodation and equipment packages available, please contact to understand more!',
  },
};
