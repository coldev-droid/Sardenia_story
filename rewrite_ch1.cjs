const fs = require('fs');

let content = fs.readFileSync('saga_data/book_1_chapter_1/05_final_chapter.md', 'utf8');

// 1. Fix Elara's Fate
content = content.replace(
  /Now, she was missing\. Her fate unknown, swallowed by the very mythscape she had studied\./g,
  "Now, she was missing. Her body had not been found, and her fate remained entirely unknown. Any theories of mythscape abduction were strictly unconfirmed hypotheses."
);

// 2. Fix the Ferry -> Motor Yacht transition
content = content.replace(
  /They stepped off the gangway and into the belly of the \*Cruise Roma\*\.[\s\S]*?It was a perfect hunting ground for something that thrived on anonymity\./,
  "They bypassed the commercial ferry terminals and stepped off a private pontoon in Port Vell, boarding the *Onda*, a sleek 60-foot motor yacht owned by his and André's front company.\nThe motor yacht was vital for their Mediterranean operations, offering speed and absolute privacy. But tonight, that isolation presented its own dangers; out on the open water, there would be nowhere to run."
);

content = content.replace(
  /They secured a utilitarian cabin on Deck 6, deep in the ship's interior\. The room was small, smelling strongly of industrial cleaner and stale sea air\. Two thin mattresses rested on metal bunks, bolted to the bulkhead\./,
  "They secured the lockbox in the master cabin below deck. The room smelled of expensive teak oil and stale sea air. A plush mattress rested in the center of the wood-paneled space."
);

content = content.replace(
  /"We rotate watches," Katia said, sitting on the edge of the top bunk,/,
  `"We rotate watches," Katia said, sitting on the edge of the mattress,`
);

content = content.replace(
  /The deep, resonant blast of the ferry's horn shook the cabin, a physical vibration that rattled the cheap fixtures and pulled Geronimo from the depths of his memory-starved sleep\. He sat up instantly, the metal springs of the bunk groaning in protest\./,
  "The low, throaty rumble of the yacht's twin marine diesels shook the cabin, a physical vibration that rattled the brass fixtures and pulled Geronimo from the depths of his memory-starved sleep. He sat up instantly, the heavy mattress absorbing his movement."
);

content = content.replace(
  /shrinking rapidly as the massive ferry churned the dark water of the harbor,/,
  "shrinking rapidly as the sleek motor yacht cut through the dark water of the harbor,"
);

// 3. Fix the passenger / deckhand scene
content = content.replace(
  /"Check the perimeter\. See if the passengers are restless\./,
  `"Check the perimeter. Make sure Mateo, the deckhand, is keeping us on course.`
);

content = content.replace(
  /Geronimo left the cabin, stepping into the narrow, fluorescent-lit corridor\. The ship was a maze of steel hallways, lined with identical cabin doors\. The air was thick with the smell of diesel and the low murmur of hundreds of passengers settling in for the overnight crossing\. He climbed the steep, narrow stairs to the upper promenade deck\. The night air was cool and heavy with salt, a stark contrast to the suffocating heat of Barcelona\. The deck was crowded with passengers leaning against the railings, watching the Spanish coast disappear into the dark\. Geronimo moved slowly through the crowd, his eyes scanning faces, looking for the telltale signs of infection\./,
  "Geronimo left the cabin, stepping into the narrow, teak-lined corridor. The yacht pitched gently as it hit the open swells. The air was thick with the smell of diesel. He climbed the short stairs to the aft deck. The night air was cool and heavy with salt, a stark contrast to the suffocating heat of Barcelona. The deck was empty save for Mateo, a young deckhand they kept on retainer, who was busy securing a loose line. Geronimo moved slowly toward the stern, his eyes scanning the darkness, looking for the telltale signs of infection."
);

content = content.replace(
  /He paused near the stern railing, lighting a cigarette to blend in with the smokers gathered there,/,
  "He paused near the stern railing, lighting a cigarette,"
);

content = content.replace(
  /A young man stood a few feet away, leaning against the glass partition that separated the open deck from the interior lounge\. The glass was dark, reflecting the sparse lights of the deck like a crude mirror\. Geronimo took a drag of his cigarette, watching the man peripherally\. The man was staring at his own reflection,/,
  "Mateo stood a few feet away, leaning against the tinted glass of the salon's sliding doors. The glass reflected the sparse navigation lights like a crude mirror. Geronimo took a drag of his cigarette, watching the deckhand peripherally. Mateo was staring at his own reflection,"
);

content = content.replace(/around the young man felt\.\.\. thin\./, "around the young man felt... thin.");

content = content.replace(/The man tilted his head/g, "Mateo tilted his head");
content = content.replace(/what the man was seeing\./g, "what Mateo was seeing.");
content = content.replace(/"Hey," the man whispered/g, `"Hey," Mateo whispered`);
content = content.replace(/The man stepped back from the glass/g, "Mateo stepped back from the glass");
content = content.replace(/the man stammered,/g, "Mateo stammered,");
content = content.replace(/The man was a blank slate,/g, "The young deckhand was a blank slate,");

fs.writeFileSync('saga_data/book_1_chapter_1/05_final_chapter.md', content);
console.log("Manuscript 05_final_chapter.md patched.");
