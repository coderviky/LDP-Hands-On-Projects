/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Specify the test file pattern
    testMatch: ['**/test/**/*.test.[jt]s?(x)'],
    verbose: true,
    forceExit: true,
    // for mongodb in memory
    globalSetup: '<rootDir>/test/globalSetup.ts',
    globalTeardown: '<rootDir>/test/globalTeardown.ts'
};
