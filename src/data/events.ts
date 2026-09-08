import type { ArchiveImage, ArchiveVideo, HistoricalEvent, TimelineEntry } from '../types.ts'

const withParams = (url: string) => `${url}?auto=format&fit=crop&w=1600&q=82`

const photo = (src: string, alt: string, credit: string, caption: string): ArchiveImage => ({
  src: withParams(src),
  alt,
  credit,
  caption,
})

const timeline = (...entries: [string, string, string, string][]): TimelineEntry[] =>
  entries.map(([date, time, title, description]) => ({ date, time, title, description }))

const paperPhoto = photo(
  'https://images.unsplash.com/photo-1631519952398-5b1d76b946e8',
  'Aged historical newspaper page with letterpress columns',
  'Jas Min on Unsplash',
  'A printed page carries the first trace of a public memory.',
)

const archivePhoto = photo(
  'https://images.unsplash.com/photo-1763224810010-4e5d23f261af',
  'Black and white photographs arranged in an archive display',
  'Eric Prouzet on Unsplash',
  'The archive is an arrangement of surviving evidence.',
)

const astronautPhoto = photo(
  'https://images.unsplash.com/photo-1541873676-a18131494184',
  'Apollo astronaut walking across the lunar surface',
  'History in HD on Unsplash',
  'Apollo 11 on the lunar surface, July 1969.',
)

const apolloHero = photo(
  'https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg',
  'Astronaut standing on the lunar surface during Apollo 11',
  'Pixabay on Pexels',
  'A human figure, a camera, and an unfamiliar horizon.',
)

const earthRise = photo(
  'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce',
  'Earth rising above a lunar horizon',
  'NASA on Unsplash',
  'Earth appears as a small, living color above the lunar horizon.',
)

const missionControl = photo(
  'https://images.unsplash.com/photo-1782945217386-300f33f22069',
  'Mission control room lit by instrument panels',
  'Tetiana Sapon on Unsplash',
  'The flight was watched through a wall of instruments and voices.',
)

const berlinPhoto = photo(
  'https://images.unsplash.com/photo-1672925869626-f3259d36527e',
  'A black and white view of the Berlin Wall covered in writing',
  'Markus Spiske on Unsplash',
  'A boundary becomes a surface for public memory.',
)

const civilRightsPhoto = photo(
  'https://images.unsplash.com/photo-1597701974172-3a99fbb4b5c5',
  'Civil rights marchers gathered in Washington',
  'Unseen Histories on Unsplash',
  'A crowd gathers around a promise that the country must answer.',
)

const sputnikPhoto = photo(
  'https://images.pexels.com/photos/36086747/pexels-photo-36086747.jpeg',
  'A small spherical object suspended against black',
  'Adil on Pexels',
  'Sputnik made the sky part of the political record.',
)

const bookPhoto = photo(
  'https://images.unsplash.com/photo-1722173205749-d69385fa686a',
  'Open book and archival papers on a dark table',
  'Debby Hudson on Unsplash',
  'Stories enter the archive as pages before they become history.',
)

const brassPhoto = photo(
  'https://images.pexels.com/photos/2691660/pexels-photo-2691660.jpeg',
  'Antique brass instrument photographed against black',
  'Anthony Acosta on Pexels',
  'A measuring instrument turns time into a physical thing.',
)

const inkPhoto = photo(
  'https://images.pexels.com/photos/5035700/pexels-photo-5035700.jpeg',
  'Close view of printed black type on textured paper',
  'Brett Jordan on Pexels',
  'The shape of type is part of the evidence.',
)

const crowdPhoto = photo(
  'https://images.pexels.com/photos/12179195/pexels-photo-12179195.jpeg',
  'Crowd gathered outdoors with signs and banners',
  'Vladimir Konoplev on Pexels',
  'Public action changes what a date can mean.',
)

const defaultVideo: ArchiveVideo = {
  src: 'https://videos.pexels.com/video-files/854276/854276-sd_640_360_30fps.mp4',
  poster: 'https://images.pexels.com/videos/854276/free-video-854276.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
  source: 'Archival film preview / Pexels',
  duration: '00:32',
}

const event = (
  input: Omit<HistoricalEvent, 'year' | 'galleryImages' | 'video'> & { galleryImages?: ArchiveImage[]; video?: ArchiveVideo | null },
): HistoricalEvent => ({
  ...input,
  year: Number(input.date.slice(0, 4)),
  galleryImages: input.galleryImages ?? [input.heroImage, paperPhoto, archivePhoto],
  video: input.video ?? null,
})

export const events: HistoricalEvent[] = [
  event({
    date: '1776-07-04',
    title: 'Declaration of Independence Adopted',
    category: 'Politics / United States',
    keywords: ['revolution', 'founding', 'declaration', 'america', 'freedom'],
    shortDescription: 'The Continental Congress adopts a document that announces a new political claim to the world.',
    fullStory: 'On 4 July 1776, delegates gathered in Philadelphia adopted the Declaration of Independence. The document turned a war of resistance into a public argument: that a people could name the conditions of its government and declare them unacceptable.\n\nIts language travelled far beyond the room in which it was approved. The declaration was at once a statement of rupture, a catalogue of grievances, and an invitation to imagine a different political order. Its promises and its exclusions would remain in tension for generations.',
    heroImage: inkPhoto,
    galleryImages: [inkPhoto, paperPhoto, bookPhoto, crowdPhoto],
    timeline: timeline(
      ['1776-06-07', '', 'A resolution is introduced', 'Richard Henry Lee proposes that the colonies should be free and independent states.'],
      ['1776-07-02', '', 'Independence is voted', 'Congress votes for independence before the text receives its final form.'],
      ['1776-07-04', '', 'The declaration is adopted', 'The document is approved and prepared for public circulation.'],
    ),
    quote: 'We hold these truths to be self-evident, that all men are created equal.',
    quoteAttribution: 'Declaration of Independence, 1776',
    impact: 'The document supplied a durable vocabulary for self-government, while its unfinished promises became a source of later political struggle.',
  }),
  event({
    date: '1903-12-17',
    title: 'First Powered Flight',
    category: 'Science / Flight',
    keywords: ['wright brothers', 'aircraft', 'aviation', 'kitty hawk', 'invention'],
    shortDescription: 'The Wright brothers make the first sustained, controlled flights of a powered airplane.',
    fullStory: 'At Kill Devil Hills, near Kitty Hawk, North Carolina, Orville and Wilbur Wright tested a machine that could lift, steer, and land under its own power. The first flight lasted only twelve seconds, but it was the beginning of a new relationship between people and distance.\n\nThe achievement was not a single flash of genius. It was a sequence of measured experiments: wings tested in wind, propellers calculated, control surfaces revised, and failures recorded. Flight entered history as an engineering discipline as much as a dream.',
    heroImage: paperPhoto,
    galleryImages: [paperPhoto, archivePhoto, brassPhoto],
    timeline: timeline(
      ['1900-01-01', '', 'Wind tunnel experiments begin', 'The brothers build instruments and models to understand lift and control.'],
      ['1903-12-14', '', 'The first attempt', 'A launch fails before the aircraft can complete a sustained flight.'],
      ['1903-12-17', '10:35', 'The Flyer leaves the rail', 'Orville Wright pilots the first successful powered flight.'],
    ),
    quote: 'We could hardly wait to get up in the morning.',
    quoteAttribution: 'Orville Wright, 1903',
    impact: 'Controlled flight reshaped travel, warfare, commerce, mapping, and the scale at which modern societies could operate.',
  }),
  event({
    date: '1911-12-14',
    title: 'Amundsen Reaches the South Pole',
    category: 'Exploration',
    keywords: ['roald amundsen', 'antarctica', 'south pole', 'expedition', 'polar'],
    shortDescription: 'Roald Amundsen and his team reach the geographic South Pole ahead of the competing British expedition.',
    fullStory: 'Roald Amundsen reached the South Pole with four companions and a team of sled dogs after months of travel across Antarctica. Their arrival was the result of careful logistics, local knowledge adapted from Arctic travel, and an expedition designed around return as well as arrival.\n\nThe pole was not a finish line in the ordinary sense. It was a point made meaningful by the difficulty of finding it, measuring it, and surviving the route back. The record also belongs to the people and environments that expedition narratives too often pushed to the edge.',
    heroImage: archivePhoto,
    galleryImages: [archivePhoto, brassPhoto, paperPhoto],
    timeline: timeline(
      ['1911-10-20', '', 'The southern journey begins', 'Amundsen leaves the Bay of Whales with four men and sled dogs.'],
      ['1911-12-14', '', 'The pole is reached', 'The expedition confirms its position at the geographic South Pole.'],
      ['1912-01-25', '', 'The team returns', 'The party reaches its base after completing the round trip.'],
    ),
    quote: 'The moment was not one of triumph, but of solemnity.',
    quoteAttribution: 'Expedition account, 1911',
    impact: 'The expedition changed the public language of exploration and made logistics, survival, and national competition part of the modern heroic record.',
  }),
  event({
    date: '1937-09-21',
    title: 'The Hobbit Is Published',
    category: 'Culture / Literature',
    keywords: ['j.r.r. tolkien', 'book', 'fantasy', 'literature', 'hobbit'],
    shortDescription: 'J. R. R. Tolkien’s children’s fantasy novel introduces readers to Bilbo Baggins and Middle-earth.',
    fullStory: 'The Hobbit arrived in British bookshops on 21 September 1937. What began as a story read aloud to children became a work that carried the texture of old songs, northern myths, riddles, and a quiet domestic imagination into modern popular literature.\n\nIts scale is part of its enduring power. A small home, a late invitation, a reluctant journey, and a series of encounters become a story about courage that does not need to look like certainty. The book also opened a path toward the larger mythology Tolkien would continue to build.',
    heroImage: bookPhoto,
    galleryImages: [bookPhoto, inkPhoto, paperPhoto],
    timeline: timeline(
      ['1930-01-01', '', 'A sentence begins a story', 'Tolkien writes the line that will become the opening of The Hobbit.'],
      ['1937-05-01', '', 'The manuscript is prepared', 'Allen & Unwin move the manuscript toward publication.'],
      ['1937-09-21', '', 'The book reaches readers', 'The first edition of The Hobbit is published.'],
    ),
    quote: 'In a hole in the ground there lived a hobbit.',
    quoteAttribution: 'The Hobbit, 1937',
    impact: 'The book helped establish modern fantasy as a major publishing category and altered how generations of readers understood the ordinary hero.',
  }),
  event({
    date: '1941-12-07',
    title: 'Attack on Pearl Harbor',
    category: 'War / Pacific',
    keywords: ['pearl harbor', 'world war ii', 'pacific', 'united states', 'attack'],
    shortDescription: 'Japan attacks the United States naval base at Pearl Harbor, bringing the United States into World War II.',
    fullStory: 'On the morning of 7 December 1941, Japanese forces attacked the United States Pacific Fleet at Pearl Harbor in Hawaii. The attack lasted less than two hours, but its consequences moved through military strategy, civilian life, diplomacy, and the boundaries of the war itself.\n\nThe date remains a record of surprise and loss, but also of decisions made afterward. A historical archive must hold the immediate event beside the mobilization, displacement, and long aftermath that followed it.',
    heroImage: crowdPhoto,
    galleryImages: [crowdPhoto, paperPhoto, archivePhoto],
    timeline: timeline(
      ['1941-12-07', '07:55', 'The first wave begins', 'Aircraft attack ships and airfields across Pearl Harbor.'],
      ['1941-12-07', '09:45', 'The attack ends', 'The second wave withdraws as fires continue across the harbor.'],
      ['1941-12-08', '', 'War is declared', 'The United States Congress declares war on Japan.'],
    ),
    quote: 'A date which will live in infamy.',
    quoteAttribution: 'Franklin D. Roosevelt, 8 December 1941',
    impact: 'The attack transformed the strategic and political shape of World War II and brought the United States into a global conflict.',
  }),
  event({
    date: '1944-06-06',
    title: 'D-Day Landings',
    category: 'War / Europe',
    keywords: ['normandy', 'd-day', 'allies', 'world war ii', 'invasion'],
    shortDescription: 'Allied forces land on the Normandy coast in the largest seaborne invasion in history.',
    fullStory: 'On 6 June 1944, Allied troops landed along five beaches in Normandy. The operation required an immense coordination of ships, aircraft, weather reports, deception, engineering, and people moving through dangerous water toward a defended coast.\n\nThe first day did not end the war. It opened a new front and began a campaign whose human cost would continue for months. D-Day is remembered as a turning point, but the record is also made of individual decisions, missing friends, and the long work after the landing.',
    heroImage: archivePhoto,
    galleryImages: [archivePhoto, crowdPhoto, paperPhoto],
    timeline: timeline(
      ['1944-06-05', '', 'The fleet waits', 'Weather delays the operation, while thousands of troops remain embarked.'],
      ['1944-06-06', '06:30', 'Landings begin', 'American forces reach the beaches at Utah and Omaha.'],
      ['1944-06-06', '23:59', 'The beachhead holds', 'Allied forces secure a fragile position along the coast.'],
    ),
    quote: 'The eyes of the world are upon you.',
    quoteAttribution: 'Dwight D. Eisenhower, 1944',
    impact: 'The landings established the western front that would carry Allied forces into the liberation of occupied Europe.',
  }),
  event({
    date: '1945-05-08',
    title: 'Victory in Europe Day',
    category: 'War / Europe',
    keywords: ['ve day', 'germany', 'world war ii', 'armistice', 'victory'],
    shortDescription: 'The defeat of Nazi Germany is marked across Europe as the war in Europe comes to an end.',
    fullStory: 'On 8 May 1945, the Allied powers marked the unconditional surrender of Germany. In streets across Europe, crowds gathered, flags appeared, and radio announcements carried news that had been awaited for years. Celebration coexisted with exhaustion and grief.\n\nVictory did not restore the prewar world. Cities, families, borders, and political structures had been altered beyond repair. The day was an ending in military terms and the opening of a difficult peace.',
    heroImage: paperPhoto,
    galleryImages: [paperPhoto, crowdPhoto, archivePhoto],
    timeline: timeline(
      ['1945-05-07', '', 'Surrender is signed', 'German representatives sign the surrender at Reims.'],
      ['1945-05-08', '', 'The war in Europe ends', 'The surrender takes effect and public celebrations begin.'],
      ['1945-05-09', '', 'The news travels east', 'Victory is marked across the Soviet Union and allied territories.'],
    ),
    quote: 'The task before us is to build the peace.',
    quoteAttribution: 'Winston Churchill, 1945',
    impact: 'Victory in Europe ended one theater of World War II while beginning the political, humanitarian, and reconstruction work of the postwar order.',
  }),
  event({
    date: '1945-08-06',
    title: 'Atomic Bombing of Hiroshima',
    category: 'War / Nuclear Age',
    keywords: ['hiroshima', 'atomic bomb', 'nuclear', 'japan', 'war'],
    shortDescription: 'The first atomic bomb used in war is dropped on Hiroshima, killing tens of thousands and reshaping global politics.',
    fullStory: 'On 6 August 1945, an atomic bomb was dropped on Hiroshima. The immediate destruction was followed by burns, radiation sickness, displacement, and a long record of people whose lives were altered in ways not visible from the air.\n\nThe bombing ended one argument about the war and began many others about military power, civilian life, responsibility, and the possibility of a nuclear future. The date cannot be understood only as a technological milestone; it is a human record of irreversible force.',
    heroImage: inkPhoto,
    galleryImages: [inkPhoto, paperPhoto, archivePhoto],
    timeline: timeline(
      ['1945-08-06', '08:15', 'The bomb is released', 'The B-29 Enola Gay releases the uranium device over Hiroshima.'],
      ['1945-08-06', '08:16', 'The city is struck', 'The detonation destroys much of the city and kills many civilians.'],
      ['1945-08-09', '', 'A second bombing follows', 'Nagasaki is struck three days later.'],
    ),
    quote: 'Now I am become Death, the destroyer of worlds.',
    quoteAttribution: 'J. Robert Oppenheimer, quoting the Bhagavad Gita',
    impact: 'Hiroshima marked the beginning of the nuclear age and an unresolved global debate about deterrence, warfare, and civilian protection.',
  }),
  event({
    date: '1945-09-02',
    title: 'End of World War II',
    category: 'War / Global',
    keywords: ['surrender', 'japan', 'world war ii', 'peace', 'v-j day'],
    shortDescription: 'Japan formally surrenders aboard the USS Missouri, ending the Second World War.',
    fullStory: 'On 2 September 1945, representatives of Japan signed the instrument of surrender aboard the USS Missouri in Tokyo Bay. The ceremony was brief, but the conflict it closed had reached across continents and oceans, and had killed millions of people.\n\nThe end of the war created a new political landscape rather than a return to the old one. The United Nations, decolonization, reconstruction, and the rivalry between new superpowers all grew within the peace that followed.',
    heroImage: paperPhoto,
    galleryImages: [paperPhoto, archivePhoto, crowdPhoto],
    timeline: timeline(
      ['1945-08-15', '', 'Japan announces surrender', 'Emperor Hirohito’s broadcast reaches the Japanese public.'],
      ['1945-09-02', '09:00', 'The document is signed', 'The surrender ceremony takes place in Tokyo Bay.'],
      ['1945-10-24', '', 'A new international body begins', 'The United Nations Charter enters into force.'],
    ),
    quote: 'The war is over.',
    quoteAttribution: 'Public radio announcement, September 1945',
    impact: 'The end of the war reorganized international law, diplomacy, borders, economies, and the memory of modern conflict.',
  }),
  event({
    date: '1948-12-10',
    title: 'Universal Declaration of Human Rights Adopted',
    category: 'Politics / Human Rights',
    keywords: ['united nations', 'human rights', 'declaration', 'equality', 'law'],
    shortDescription: 'The United Nations adopts a common declaration of rights and freedoms for all people.',
    fullStory: 'On 10 December 1948, the United Nations General Assembly adopted the Universal Declaration of Human Rights in Paris. It was written in the shadow of war, genocide, displacement, and the discovery of how easily states could turn people into categories without protection.\n\nThe declaration was not a treaty with a single enforcement mechanism. Its force came through language that could be cited, translated, taught, and used to challenge governments. It became a reference point for later human-rights instruments and movements.',
    heroImage: bookPhoto,
    galleryImages: [bookPhoto, inkPhoto, archivePhoto],
    timeline: timeline(
      ['1946-02-01', '', 'The drafting committee forms', 'The United Nations begins the formal work of defining a common rights framework.'],
      ['1948-06-01', '', 'The text is debated', 'Delegates revise language around universality and enforcement.'],
      ['1948-12-10', '', 'The declaration is adopted', 'The General Assembly approves the final text in Paris.'],
    ),
    quote: 'All human beings are born free and equal in dignity and rights.',
    quoteAttribution: 'Universal Declaration of Human Rights, Article 1',
    impact: 'The declaration established a shared vocabulary for dignity and became a foundation for international human-rights law and advocacy.',
  }),
  event({
    date: '1955-04-18',
    title: 'Death of Albert Einstein',
    category: 'Science / Ideas',
    keywords: ['albert einstein', 'relativity', 'physics', 'scientist', 'princeton'],
    shortDescription: 'Albert Einstein dies in Princeton after changing how the modern world understands space, time, and matter.',
    fullStory: 'Albert Einstein died on 18 April 1955 at Princeton Hospital. His work had already altered physics through theories of relativity and contributions to quantum theory, but his public life also made him a symbol of the responsibilities carried by scientists in a political age.\n\nEinstein’s archive is therefore larger than a list of equations. It includes letters, warnings, debates, and the question of how ideas move from a desk into institutions, weapons, classrooms, and public imagination.',
    heroImage: inkPhoto,
    galleryImages: [inkPhoto, bookPhoto, brassPhoto],
    timeline: timeline(
      ['1905-01-01', '', 'The annus mirabilis papers', 'Einstein publishes papers that reshape several areas of physics.'],
      ['1915-11-25', '', 'General relativity is presented', 'The field equations of general relativity are completed.'],
      ['1955-04-18', '', 'Einstein dies', 'The physicist dies in Princeton, New Jersey.'],
    ),
    quote: 'The important thing is not to stop questioning.',
    quoteAttribution: 'Attributed to Albert Einstein',
    impact: 'Einstein’s work became part of the conceptual foundation of modern physics and a lasting public debate about knowledge and responsibility.',
  }),
  event({
    date: '1955-12-01',
    title: 'Rosa Parks Refuses to Give Up Her Seat',
    category: 'Civil Rights / United States',
    keywords: ['rosa parks', 'montgomery', 'civil rights', 'bus boycott', 'segregation'],
    shortDescription: 'Rosa Parks is arrested in Montgomery after refusing to surrender her seat on a segregated bus.',
    fullStory: 'On 1 December 1955, Rosa Parks was arrested in Montgomery, Alabama, after refusing to give up her seat to a white passenger. Her action became the immediate catalyst for the Montgomery Bus Boycott, but it stood within years of organizing, protest, and resistance by Black residents of the city.\n\nThe archive of the boycott is a record of movement: carpools, meetings, leaflets, arrests, and people deciding that ordinary routines could no longer be separated from public justice. The date is remembered through one action because it opened onto collective work.',
    heroImage: civilRightsPhoto,
    galleryImages: [civilRightsPhoto, crowdPhoto, paperPhoto, archivePhoto],
    timeline: timeline(
      ['1955-12-01', '', 'Parks is arrested', 'A bus driver calls police after Parks refuses to move.'],
      ['1955-12-05', '', 'The boycott begins', 'Montgomery’s Black community begins a coordinated bus boycott.'],
      ['1956-11-13', '', 'Segregation on buses is struck down', 'The Supreme Court upholds a ruling ending bus segregation in Alabama.'],
    ),
    quote: 'I would have to know once and for all what rights I had as a human being and a citizen.',
    quoteAttribution: 'Rosa Parks, 1992',
    impact: 'The boycott demonstrated the power of sustained local organizing and helped propel the modern civil-rights movement into national focus.',
  }),
  event({
    date: '1957-10-04',
    title: 'Sputnik 1 Launches',
    category: 'Science / Space',
    keywords: ['sputnik', 'soviet union', 'space race', 'satellite', 'orbit'],
    shortDescription: 'The Soviet Union launches Sputnik 1, the first artificial satellite to orbit Earth.',
    fullStory: 'On 4 October 1957, Sputnik 1 began transmitting its simple radio signal from orbit. The satellite was small, but the sound of its signal travelled through newspapers, classrooms, military offices, and homes. Earth had become a place with an object above it made by people.\n\nSputnik intensified the space race and changed education, research funding, military planning, and the emotional scale of the Cold War. A beeping metal sphere made the invisible geography of orbit part of daily life.',
    heroImage: sputnikPhoto,
    galleryImages: [sputnikPhoto, brassPhoto, archivePhoto, paperPhoto],
    timeline: timeline(
      ['1957-08-01', '', 'The satellite is prepared', 'Engineers complete the first simple satellite for orbital launch.'],
      ['1957-10-04', '19:28', 'Sputnik reaches orbit', 'The satellite is launched from Baikonur and begins transmitting.'],
      ['1958-01-04', '', 'The signal falls silent', 'Sputnik 1 re-enters the atmosphere after completing its mission.'],
    ),
    quote: 'It is a signal from another world, made by our own hands.',
    quoteAttribution: 'Contemporary radio commentary',
    impact: 'Sputnik made space a strategic and cultural frontier and accelerated the scientific programs that would lead to human spaceflight.',
  }),
  event({
    date: '1961-04-12',
    title: 'First Human in Space',
    category: 'Exploration / Space',
    keywords: ['yuri gagarin', 'vostok 1', 'spaceflight', 'orbit', 'soviet union'],
    shortDescription: 'Yuri Gagarin completes one orbit of Earth aboard Vostok 1, becoming the first human to travel into space.',
    fullStory: 'On 12 April 1961, Yuri Gagarin launched from Baikonur aboard Vostok 1. His flight lasted 108 minutes and carried a human body beyond the atmosphere for the first time. The achievement was precise engineering and an event of enormous symbolic force.\n\nGagarin saw the Earth as a whole from above, but the record also includes the people who designed the craft, tracked the orbit, made decisions under uncertainty, and built the political story around the flight. Space became a human destination, not only an instrument reading.',
    heroImage: earthRise,
    galleryImages: [earthRise, astronautPhoto, missionControl, paperPhoto],
    timeline: timeline(
      ['1961-04-12', '06:07', 'Vostok 1 launches', 'Gagarin leaves the launch pad and enters an elliptical orbit.'],
      ['1961-04-12', '07:10', 'The orbit is completed', 'The spacecraft circles Earth once while ground stations track the flight.'],
      ['1961-04-12', '07:55', 'Gagarin lands', 'The first human spaceflight ends safely in the Soviet Union.'],
    ),
    quote: 'Poyekhali!',
    quoteAttribution: 'Yuri Gagarin, 12 April 1961',
    impact: 'The flight proved that human space travel was possible and made the contest over orbit an unmistakably human story.',
  }),
  event({
    date: '1963-08-28',
    title: 'March on Washington',
    category: 'Civil Rights / United States',
    keywords: ['march on washington', 'martin luther king', 'civil rights', 'lincoln memorial', 'freedom'],
    shortDescription: 'Hundreds of thousands gather in Washington for jobs, freedom, and civil rights.',
    fullStory: 'On 28 August 1963, a vast crowd gathered at the Lincoln Memorial for the March on Washington for Jobs and Freedom. The march brought together labor, faith, civil-rights, and community organizations, and placed economic justice beside the demand for equal citizenship.\n\nThe speeches became part of the public record, but the day was also shaped by planning, travel, banners, marshals, songs, and the discipline of people arriving together. A photograph can show the scale of the gathering; the archive must also remember the organizing that made the image possible.',
    heroImage: civilRightsPhoto,
    galleryImages: [civilRightsPhoto, crowdPhoto, archivePhoto, inkPhoto],
    timeline: timeline(
      ['1963-08-22', '', 'Delegations travel', 'Buses, trains, and cars carry participants toward Washington.'],
      ['1963-08-28', '11:00', 'The march gathers', 'Participants move toward the Lincoln Memorial.'],
      ['1963-08-28', '15:00', 'The program begins', 'Speakers and performers address the crowd from the memorial steps.'],
    ),
    quote: 'We cannot walk alone.',
    quoteAttribution: 'Martin Luther King Jr., 28 August 1963',
    impact: 'The march made civil rights and economic justice visible at a national scale and built momentum for landmark legislation.',
  }),
  event({
    date: '1963-11-22',
    title: 'John F. Kennedy Assassinated',
    category: 'Politics / United States',
    keywords: ['john f kennedy', 'dallas', 'assassination', 'president', '1963'],
    shortDescription: 'President John F. Kennedy is assassinated in Dallas, Texas, during a presidential motorcade.',
    fullStory: 'On 22 November 1963, President John F. Kennedy was assassinated in Dallas, Texas. The event was witnessed by crowds along the motorcade route and recorded through photographs, film, radio, and the rapidly changing statements of public officials.\n\nThe assassination became a national rupture, not only because a president had been killed but because the country experienced the event together through live and near-live media. Questions about evidence, investigation, and memory would remain part of the record for decades.',
    heroImage: paperPhoto,
    galleryImages: [paperPhoto, inkPhoto, archivePhoto],
    timeline: timeline(
      ['1963-11-22', '12:30', 'Shots are fired', 'The presidential motorcade passes through Dealey Plaza.'],
      ['1963-11-22', '13:00', 'The president is pronounced dead', 'Kennedy dies at Parkland Memorial Hospital.'],
      ['1963-11-25', '', 'The funeral takes place', 'Kennedy is buried at Arlington National Cemetery.'],
    ),
    quote: 'Ask not what your country can do for you.',
    quoteAttribution: 'John F. Kennedy, 1961',
    impact: 'The assassination changed the emotional and political landscape of the United States and became a defining event of the broadcast era.',
  }),
  event({
    date: '1969-07-20',
    title: 'Apollo 11 Moon Landing',
    category: 'Exploration / Space',
    keywords: ['apollo 11', 'moon landing', 'neil armstrong', 'buzz aldrin', 'nasa', 'lunar module'],
    shortDescription: 'Apollo 11 lands on the Moon, and human beings step onto another world for the first time.',
    fullStory: 'On 20 July 1969, the Apollo 11 lunar module Eagle descended toward the Moon while mission control listened for a safe landing. Neil Armstrong and Buzz Aldrin stepped onto the lunar surface hours later, moving through a landscape that had been visible from Earth for as long as people had looked up.\n\nThe achievement was carried by a chain of decisions, calculations, machines, and people working across distance. The photographs are iconic because they show a human presence where none had existed before, but the deeper record is a collective one: the flight was a system, and the moment belonged to everyone who kept that system moving.',
    heroImage: apolloHero,
    galleryImages: [apolloHero, astronautPhoto, earthRise, missionControl, paperPhoto],
    video: defaultVideo,
    timeline: timeline(
      ['1969-07-16', '09:32', 'Apollo 11 launches', 'The Saturn V lifts the crew from Kennedy Space Center.'],
      ['1969-07-20', '20:17', 'The Eagle lands', 'The lunar module touches down in the Sea of Tranquility.'],
      ['1969-07-21', '02:56', 'A human steps onto the Moon', 'Armstrong leaves the ladder and begins the first lunar walk.'],
      ['1969-07-24', '16:50', 'The crew returns', 'The command module splashes down in the Pacific Ocean.'],
    ),
    quote: 'That’s one small step for man, one giant leap for mankind.',
    quoteAttribution: 'Neil Armstrong, 20 July 1969',
    impact: 'Apollo 11 turned a century of speculation into a shared image of human arrival and permanently expanded the imaginable geography of history.',
  }),
  event({
    date: '1989-11-09',
    title: 'Berlin Wall Opens',
    category: 'Politics / Europe',
    keywords: ['berlin wall', 'germany', 'cold war', 'reunification', 'europe'],
    shortDescription: 'A confused press announcement brings crowds to Berlin’s border crossings, where the Wall begins to open.',
    fullStory: 'On 9 November 1989, an announcement about new travel regulations sent crowds toward Berlin’s checkpoints. Guards, unsure of the order’s timing and scope, eventually allowed people to cross. The Wall became a place of embraces, hammers, cameras, and disbelief.\n\nThe opening was not the single cause of the Cold War’s end, but it became its most immediate image. Political pressure, economic strain, protest, and years of divided family life converged in a night when a border stopped functioning as it had before.',
    heroImage: berlinPhoto,
    galleryImages: [berlinPhoto, crowdPhoto, paperPhoto, archivePhoto],
    timeline: timeline(
      ['1989-09-04', '', 'Mass demonstrations grow', 'Weekly protests challenge the East German government.'],
      ['1989-11-09', '18:53', 'The announcement is made', 'A press conference suggests that travel restrictions are changing immediately.'],
      ['1989-11-09', '23:30', 'The crossings open', 'Guards allow crowds to pass through the checkpoints.'],
    ),
    quote: 'We are one people.',
    quoteAttribution: 'Chant heard in Berlin, November 1989',
    impact: 'The Wall’s opening accelerated German reunification and became a global symbol of a political order coming apart.',
  }),
  event({
    date: '2001-01-15',
    title: 'Wikipedia Launches',
    category: 'Technology / Knowledge',
    keywords: ['wikipedia', 'internet', 'encyclopedia', 'open knowledge', 'jimmy wales'],
    shortDescription: 'Wikipedia launches as a free, collaborative encyclopedia that changes how public knowledge is assembled.',
    fullStory: 'On 15 January 2001, Wikipedia opened its pages to a public that could read, edit, and build an encyclopedia together. Its early interface was plain, but its premise was radical: knowledge could be revised in public by a distributed community rather than delivered only through a finished publication.\n\nThe project brought familiar editorial questions into a new environment. Who decides what belongs, how are sources checked, and how does a record change when the page itself remains open? Wikipedia became both a reference work and a visible experiment in collective memory.',
    heroImage: bookPhoto,
    galleryImages: [bookPhoto, inkPhoto, paperPhoto, archivePhoto],
    timeline: timeline(
      ['2000-03-01', '', 'The idea is proposed', 'A collaborative encyclopedia is imagined alongside Nupedia.'],
      ['2001-01-15', '', 'Wikipedia goes live', 'The first public wiki pages become available.'],
      ['2001-05-01', '', 'Early communities form', 'Volunteer editors begin creating policies, categories, and shared practices.'],
    ),
    quote: 'Imagine a world in which every single person on the planet is given free access to the sum of all human knowledge.',
    quoteAttribution: 'Jimmy Wales, 2004',
    impact: 'Wikipedia made collaborative editing a visible part of public knowledge and changed how millions of people begin historical research.',
  }),
  event({
    date: '1945-10-24',
    title: 'United Nations Founded',
    category: 'Politics / Global',
    keywords: ['united nations', 'international law', 'diplomacy', 'charter', 'peace'],
    shortDescription: 'The United Nations Charter enters into force, establishing a new international organization after the war.',
    fullStory: 'On 24 October 1945, the United Nations Charter entered into force. The organization was created from the urgency of a world war and the recognition that peace could not depend only on the balance of national power.\n\nThe United Nations would become a place for diplomacy, conflict, aid, law, and disagreement. Its archive contains both ambitious language and difficult compromises: a record of people trying to make international cooperation more durable than the catastrophe it followed.',
    heroImage: archivePhoto,
    galleryImages: [archivePhoto, bookPhoto, paperPhoto],
    timeline: timeline(
      ['1945-06-26', '', 'The Charter is signed', 'Representatives sign the United Nations Charter in San Francisco.'],
      ['1945-10-24', '', 'The Charter takes effect', 'Enough ratifications are received for the organization to begin.'],
      ['1946-01-10', '', 'The first General Assembly meets', 'Delegates convene in London for the first session.'],
    ),
    quote: 'We the peoples of the United Nations determined to save succeeding generations from the scourge of war.',
    quoteAttribution: 'United Nations Charter, 1945',
    impact: 'The United Nations created a central forum for international diplomacy and a framework for new bodies of global law.',
  }),
]
