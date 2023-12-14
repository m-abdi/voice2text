mod utils;

use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

#[wasm_bindgen]
pub fn change_range(input: &[f32]) -> Vec<f32> {
    let mut output = Vec::with_capacity(input.len());
    for x in input {
        output.push(x * 32767.0)
    }
    output
}
