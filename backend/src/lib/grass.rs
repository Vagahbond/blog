use rand::prelude::*;
use std::sync::Mutex;

static GRASS_ID: Mutex<u32> = Mutex::new(0);

pub struct Grass {
    age: u8, // age 1 to 100
    // // Random number at the base of the generation, even though that means there may be some doubles
    pub seed: f64,
    pub id: u32,
}

impl Grass {
    pub fn new() -> Self {
        let mut rng = rand::rng();

        let mut grass_id = GRASS_ID.lock().unwrap();

        let res = Grass {
            id: *grass_id,
            age: 0,
            seed: rng.random::<f64>(), // Seed doubles as an ID
        };

        *grass_id += 1;
        return res;
    }

    /*
     *  formatting of a grass blade:
     *  first bytes -> "grass"
     *  next byte : age
     *  next 8 bytes seed
     */
    pub fn wrap(&self) -> [u8; 13] {
        let mut res: [u8; 13] = [0; 13];

        res[0] = self.age.clone();

        res[1..9]
            .as_mut()
            .clone_from_slice(&self.seed.to_ne_bytes());

        res[9..13].as_mut().clone_from_slice(&self.id.to_ne_bytes());

        return res;
    }

    pub fn tick(&mut self) {
        if self.age < 100 {
            self.age += 1;
        }
    }
}
