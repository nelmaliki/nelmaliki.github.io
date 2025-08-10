---
title: "Implementing Linear Regression from Scratch"
date: "2024-01-18"
description: "Building my first ML algorithm without any libraries to truly understand the fundamentals"
---

# Implementing Linear Regression from Scratch

After a week of studying the theory, I decided to implement linear regression from scratch using only NumPy. No scikit-learn, no TensorFlow - just pure mathematics translated into code. This exercise taught me more about machine learning than any tutorial ever could.

## What is Linear Regression?

Linear regression is perhaps the simplest machine learning algorithm. It tries to find a linear relationship between input features (X) and a target variable (y). The goal is to find the best-fitting line through the data points.

The equation is simple:
```
y = wx + b
```

Where:
- `w` is the weight (slope)
- `b` is the bias (y-intercept)
- `x` is our input feature
- `y` is our prediction

## The Mathematics

### Cost Function

To find the best line, we need to define what "best" means. We use the Mean Squared Error (MSE) as our cost function:

```
J(w,b) = (1/2m) Σ(ŷᵢ - yᵢ)²
```

Where:
- `m` is the number of training examples
- `ŷᵢ` is our prediction for example i
- `yᵢ` is the actual value for example i

### Gradient Descent

To minimize the cost function, we use gradient descent. We calculate the partial derivatives of the cost function with respect to our parameters:

```
∂J/∂w = (1/m) Σ(ŷᵢ - yᵢ)xᵢ
∂J/∂b = (1/m) Σ(ŷᵢ - yᵢ)
```

Then update our parameters:
```
w = w - α(∂J/∂w)
b = b - α(∂J/∂b)
```

Where α is the learning rate.

## My Implementation

Here's my complete implementation with detailed comments:

```python
import numpy as np
import matplotlib.pyplot as plt

class LinearRegression:
    def __init__(self, learning_rate=0.01, n_iterations=1000):
        self.learning_rate = learning_rate
        self.n_iterations = n_iterations
        self.weights = None
        self.bias = None
        self.cost_history = []
    
    def fit(self, X, y):
        """
        Train the linear regression model
        X: Training data (m samples, n features)
        y: Target values (m samples)
        """
        # Get number of samples and features
        n_samples, n_features = X.shape
        
        # Initialize parameters
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Gradient descent
        for i in range(self.n_iterations):
            # Forward propagation
            y_predicted = self.predict(X)
            
            # Calculate cost (MSE)
            cost = (1/n_samples) * np.sum((y_predicted - y)**2)
            self.cost_history.append(cost)
            
            # Calculate gradients
            dw = (1/n_samples) * np.dot(X.T, (y_predicted - y))
            db = (1/n_samples) * np.sum(y_predicted - y)
            
            # Update parameters
            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db
            
            # Print progress
            if i % 100 == 0:
                print(f"Iteration {i}, Cost: {cost:.4f}")
    
    def predict(self, X):
        """Make predictions"""
        return np.dot(X, self.weights) + self.bias
```

## Testing on Real Data

I created a simple dataset to test my implementation:

```python
# Generate synthetic data
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X[:, 0] + np.random.randn(100)

# Train the model
model = LinearRegression(learning_rate=0.1, n_iterations=1000)
model.fit(X, y)

# Make predictions
y_pred = model.predict(X)

# Calculate R² score
ss_res = np.sum((y - y_pred) ** 2)
ss_tot = np.sum((y - np.mean(y)) ** 2)
r2_score = 1 - (ss_res / ss_tot)
print(f"R² Score: {r2_score:.4f}")
```

## Visualizing the Results

One of the most satisfying parts was seeing the algorithm learn:

```python
# Plot the results
plt.figure(figsize=(12, 4))

# Plot 1: Data and fitted line
plt.subplot(1, 3, 1)
plt.scatter(X, y, alpha=0.5)
plt.plot(X, y_pred, 'r-', linewidth=2)
plt.xlabel('X')
plt.ylabel('y')
plt.title('Linear Regression Fit')

# Plot 2: Cost over iterations
plt.subplot(1, 3, 2)
plt.plot(model.cost_history)
plt.xlabel('Iteration')
plt.ylabel('Cost')
plt.title('Cost Function During Training')

# Plot 3: Residuals
plt.subplot(1, 3, 3)
residuals = y - y_pred
plt.scatter(y_pred, residuals, alpha=0.5)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel('Predicted Values')
plt.ylabel('Residuals')
plt.title('Residual Plot')

plt.tight_layout()
plt.show()
```

## Key Learnings

### 1. The Importance of Feature Scaling

When I first tried this with multiple features of different scales, the model converged very slowly. Normalizing features made a huge difference:

```python
def normalize_features(X):
    mean = np.mean(X, axis=0)
    std = np.std(X, axis=0)
    return (X - mean) / std
```

### 2. Learning Rate Matters

Too high and the cost function diverges:
```
Iteration 0, Cost: 523.45
Iteration 100, Cost: 9834.23  # Getting worse!
```

Too low and it takes forever to converge:
```
Iteration 0, Cost: 523.45
Iteration 1000, Cost: 522.89  # Barely moved!
```

### 3. Vectorization is Crucial

My first attempt used loops for everything. It was painfully slow. Vectorized operations with NumPy made it 100x faster:

```python
# Slow (with loops)
for i in range(m):
    error += (predictions[i] - y[i]) ** 2

# Fast (vectorized)
error = np.sum((predictions - y) ** 2)
```

## Extending to Multiple Features

Once single-feature regression worked, extending to multiple features was straightforward:

```python
# Generate data with 3 features
X = np.random.randn(1000, 3)
true_weights = np.array([2, -3.5, 1.2])
y = X.dot(true_weights) + 5 + 0.1 * np.random.randn(1000)

# Train model
model = LinearRegression(learning_rate=0.1, n_iterations=500)
model.fit(X, y)

print(f"True weights: {true_weights}")
print(f"Learned weights: {model.weights}")
print(f"True bias: 5")
print(f"Learned bias: {model.bias:.2f}")
```

Output:
```
True weights: [ 2.  -3.5  1.2]
Learned weights: [ 1.99 -3.49  1.21]
True bias: 5
Learned bias: 5.01
```

Almost perfect! The algorithm successfully recovered the true parameters.

## Comparison with Scikit-learn

To validate my implementation, I compared it with scikit-learn:

```python
from sklearn.linear_model import LinearRegression as SklearnLR

# My implementation
my_model = LinearRegression()
my_model.fit(X, y)
my_predictions = my_model.predict(X)

# Scikit-learn
sklearn_model = SklearnLR()
sklearn_model.fit(X, y)
sklearn_predictions = sklearn_model.predict(X)

# Compare
print(f"My weights: {my_model.weights}")
print(f"Sklearn weights: {sklearn_model.coef_}")
print(f"Difference: {np.abs(my_model.weights - sklearn_model.coef_).mean():.6f}")
```

The results were nearly identical! This gave me confidence that my understanding was correct.

## What's Next?

Now that I've mastered basic linear regression, I'm ready to tackle:
- **Polynomial regression** for non-linear relationships
- **Ridge and Lasso regression** for regularization
- **Logistic regression** for classification

Building this from scratch has given me a deep appreciation for what happens inside ML libraries. Every `.fit()` call now has meaning beyond just "train the model."

## Resources and References

- Andrew Ng's Machine Learning Course - Where I learned the theory
- "The Elements of Statistical Learning" - For deeper mathematical understanding
- NumPy documentation - My constant companion during implementation

The complete code is available on my [GitHub](https://github.com/yourusername/ml-from-scratch).

Next week: Neural Networks from scratch. If linear regression is algebra, neural networks are calculus. I can't wait!