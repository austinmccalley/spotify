import numpy as np


# Generate a random matrix of size (n,m)
def random_matrix(n, m):
    return np.random.randint(0, 10, (n, m))

# Generate an identity matrix of size (n,n)


def identity_matrix(n):
    return np.identity(n)


def ones_matrix(n):
    return np.ones((n, n))


X_main = random_matrix(3, 3)
X_main = [[6, 4, 0], [0, 3, 5], [2, 6, 0]]
X = X_main

# Turn X into a numpy array
X = np.array(X)

H = ones_matrix(3) * 1/3

H = identity_matrix(3) - H

X = H @ X

# cov = X.T @ X / X.shape[0]
cov = X.T @ X

# cov = ones_matrix(3)

# cov /= X.shape[0]

# Printing the covariance matrix.
print(cov)

# print(X.T @ X / X.shape[0])

# eigvals, eigvecs = np.linalg.eig(cov)
# print(eigvals)
# print(eigvecs)
