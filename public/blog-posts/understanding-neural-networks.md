---
title: "Understanding Neural Networks from First Principles"
date: "2024-01-22"
description: "Breaking down the mathematics and intuition behind neural networks"
---

# Understanding Neural Networks from First Principles

After spending a week implementing linear regression from scratch, I've moved on to one of the most fundamental concepts in deep learning: neural networks. This post documents my understanding of how they work, both mathematically and intuitively.

## What is a Neural Network?

At its core, a neural network is a function approximator. Given some input, it produces an output by passing the data through multiple layers of interconnected nodes (neurons). Each connection has a weight, and each neuron has a bias.

### The Biological Inspiration

Neural networks are loosely inspired by the human brain. Just as biological neurons receive signals, process them, and send outputs to other neurons, artificial neurons perform similar operations with numbers.

## The Math Behind It

### Forward Propagation

For a simple neural network with one hidden layer:

1. **Input to Hidden Layer**:
   ```
   z₁ = W₁x + b₁
   a₁ = σ(z₁)
   ```

2. **Hidden to Output Layer**:
   ```
   z₂ = W₂a₁ + b₂
   ŷ = σ(z₂)
   ```

Where:
- `W` represents weight matrices
- `b` represents bias vectors
- `σ` is the activation function
- `x` is the input
- `ŷ` is the predicted output

### Activation Functions

Activation functions introduce non-linearity into the network. Without them, even a deep network would just be a linear transformation.

Common activation functions I've studied:
- **ReLU**: `f(x) = max(0, x)`
- **Sigmoid**: `f(x) = 1 / (1 + e^(-x))`
- **Tanh**: `f(x) = (e^x - e^(-x)) / (e^x + e^(-x))`

## Backpropagation: The Learning Algorithm

This is where things get interesting. Backpropagation is how neural networks learn. It's essentially the chain rule from calculus applied repeatedly.

### The Process

1. **Calculate the loss**: Compare predicted output with actual output
2. **Compute gradients**: Use chain rule to find how each weight affects the loss
3. **Update weights**: Adjust weights in the direction that reduces loss

### Implementation Insight

Here's a simplified Python implementation I wrote to understand the concept:

```python
class SimpleNeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.W1 = np.random.randn(input_size, hidden_size) * 0.01
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.01
        self.b2 = np.zeros((1, output_size))
    
    def forward(self, X):
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = np.maximum(0, self.z1)  # ReLU activation
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = self.sigmoid(self.z2)
        return self.a2
    
    def backward(self, X, y, learning_rate=0.01):
        m = X.shape[0]
        
        # Output layer gradients
        dz2 = self.a2 - y
        dW2 = (1/m) * np.dot(self.a1.T, dz2)
        db2 = (1/m) * np.sum(dz2, axis=0, keepdims=True)
        
        # Hidden layer gradients
        da1 = np.dot(dz2, self.W2.T)
        dz1 = da1 * (self.z1 > 0)  # ReLU derivative
        dW1 = (1/m) * np.dot(X.T, dz1)
        db1 = (1/m) * np.sum(dz1, axis=0, keepdims=True)
        
        # Update parameters
        self.W2 -= learning_rate * dW2
        self.b2 -= learning_rate * db2
        self.W1 -= learning_rate * dW1
        self.b1 -= learning_rate * db1
```

## Key Insights and "Aha!" Moments

### 1. Why Deep Networks?
Initially, I wondered why we need multiple layers. The answer: each layer can learn increasingly abstract features. In image recognition, early layers might detect edges, middle layers detect shapes, and deeper layers recognize objects.

### 2. The Vanishing Gradient Problem
When networks get very deep, gradients can become extremely small, making learning nearly impossible. This is why techniques like ReLU activation and batch normalization were developed.

### 3. Universal Approximation Theorem
A neural network with just one hidden layer can theoretically approximate any continuous function! But deeper networks are often more efficient in practice.

## Practical Experiments

I tested my understanding by training a simple network on the MNIST dataset:

```python
# Results after 100 epochs:
# Training accuracy: 97.8%
# Test accuracy: 96.2%
```

The fact that 784 pixels can be transformed into 10 digit classifications through matrix multiplications and non-linear functions still amazes me!

## Challenges and Gotchas

1. **Weight Initialization**: Random initialization matters! Too large and gradients explode, too small and they vanish.

2. **Learning Rate**: Finding the right learning rate is crucial. Too high and the model diverges, too low and training takes forever.

3. **Debugging**: Unlike traditional programming, debugging neural networks is tricky. The model might train without errors but still perform poorly.

## What's Next?

Now that I understand the basics of neural networks, I'm excited to explore:
- **Convolutional Neural Networks (CNNs)** for image processing
- **Recurrent Neural Networks (RNNs)** for sequential data
- **Attention mechanisms** and the Transformer architecture

## Resources That Helped

- [3Blue1Brown's Neural Network Series](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) - Best visual explanations
- Michael Nielsen's "Neural Networks and Deep Learning" book
- PyTorch tutorials for practical implementation

The journey from "neural networks are black boxes" to "I can implement one from scratch" has been incredibly rewarding. Next stop: CNNs!