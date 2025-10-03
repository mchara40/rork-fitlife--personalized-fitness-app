// Minimal react-native shim for server-side Node execution
// Provides Platform API used in server files to gate behavior
module.exports = {
  Platform: { OS: 'web' },
};


