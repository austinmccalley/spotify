mod utils;

use std::ops::{Div, Mul, Sub};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, pca-wasm!");
}

pub fn identity(n: usize) -> Vec<Vec<f64>> {
    assert!(n > 0);

    let mut result = Vec::new();

    for i in 0..n {
        let mut row = Vec::new();
        for j in 0..n {
            if i == j {
                row.push(1.0);
            } else {
                row.push(0.0);
            }
        }
        result.push(row);
    }

    result
}

pub fn matrix_subtract<T>(a: Vec<Vec<T>>, b: Vec<Vec<T>>) -> Vec<Vec<T>>
where
    for<'a> &'a T: Sub<&'a T, Output = T>,
{
    assert!(a.len() > 0);
    assert!(a.len() > 0);
    assert!(a[0].len() > 0);
    assert!(b.len() > 0);
    assert!(b[0].len() > 0);

    assert!(a.len() == b.len());
    assert!(a[0].len() == b[0].len());

    a.iter()
        .zip(b.iter())
        .map(|(row_a, row_b)| row_a.iter().zip(row_b.iter()).map(|(a, b)| a - b).collect())
        .collect()
}

pub fn matrix_mult(a: Vec<Vec<f64>>, b: Vec<Vec<f64>>) -> Vec<Vec<f64>> {
    assert!(a.len() > 0);
    assert!(a[0].len() > 0);
    assert!(b.len() > 0);
    assert!(b[0].len() > 0);

    assert!(a.len() == b.len());
    assert!(a[0].len() == b[0].len());

    // Result matrix is a.len() x b[0].len()
    let mut result = Vec::new();

    for i in 0..a.len() {
        let mut row = Vec::new();
        for j in 0..b[0].len() {
            let mut sum = 0.0;
            for k in 0..a[0].len() {
                sum += a[i][k] * b[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }

    result
}

pub fn scalar_matrix_mult<T>(a: &T, b: Vec<Vec<T>>) -> Vec<Vec<T>>
where
    for<'b> &'b T: Mul<&'b T, Output = T>,
{
    assert!(b.len() > 0);
    assert!(b[0].len() > 0);

    b.iter()
        .map(|row| row.iter().map(|b| a * b).collect())
        .collect()
}

pub fn scalar_matrix_div(a: f64, b: &Vec<Vec<f64>>) -> Vec<Vec<f64>>
{
    assert!(b.len() > 0);
    assert!(b[0].len() > 0);

    // Result matrix is same size as b
    let mut result = Vec::new();

    for i in 0..b.len() {
        let mut row = Vec::new();
        for j in 0..b[0].len() {
            row.push(b[i][j] / a);
        }
        result.push(row);
    }

    result
}

pub fn center_matrix(n: usize) -> Vec<Vec<f64>> {
    assert!(n > 0);

    let identit = identity(n);
    let mut ones = vec![vec![1.0; n]; n];

    let one_nth = 1.0 / n as f64;

    ones = scalar_matrix_mult(&one_nth, ones);

    matrix_subtract(identit, ones)
}

pub fn div_ceil(a: f64, b: f64) -> usize {
    ((a + b - 1.0) / b) as usize
}

pub fn transpose<T>(v: &Vec<Vec<T>>) -> Vec<Vec<T>>
where
    T: Clone,
{
    assert!(v.len() > 0);

    (0..v[0].len())
        .map(|i| v.iter().map(|row| row[i].clone()).collect())
        .collect()
}

#[wasm_bindgen]
pub fn principal_component_analysis(
    data: &[f64],
    _n_components: usize,
    row_len: usize,
) -> Vec<f64> {
    let mut matrix = Vec::new();

    // Get the amount of rows in data
    let n_rows = div_ceil(data.len() as f64, row_len as f64);

    // Build the matrix
    for i in 0..n_rows {
        let mut row = Vec::new();
        for j in 0..row_len {
            row.push(data[(i * row_len + j) as usize]);
        }
        matrix.push(row);
    }

    // Make a copy of the matrix
    let matrix_copy = matrix.clone();

    // Center the matrix
    let mut centered_matrix = center_matrix(n_rows);
    centered_matrix = matrix_mult(centered_matrix, matrix_copy);

    let mt = transpose(&centered_matrix);

    // Compute the covariance matrix
    let mut covariance_matrix = matrix_mult(mt, centered_matrix);
    covariance_matrix = scalar_matrix_div(n_rows as f64, &covariance_matrix);

    // Compute the eigenvalues and eigenvectors

    // Remap the matrix into one long vector
    let mut matrix_vec = Vec::new();
    for row in covariance_matrix {
        matrix_vec.extend(row);
    }

    matrix_vec
}
