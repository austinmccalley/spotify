//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use pcawasm::principal_component_analysis;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[wasm_bindgen_test]
fn pca() {
    let data = vec![6.0, 4.0, 0.0, 0.0, 3.0, 5.0, 2.0, 6.0, 0.0];
    let n_components = 2;
    let row_len = 3;

    let result = principal_component_analysis(&data, n_components, row_len);

    assert_eq!(result.len(), 9);
    assert_eq!(result[0], 6.222222222222221);
    assert_eq!(result[1], 0.44444444444444464);
    assert_eq!(result[2], -4.444444444444445);
}
