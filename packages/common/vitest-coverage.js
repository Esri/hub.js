// NOTE: we are temporarily placing the vitest coverage config here
// so that the karma config can exclude the files that are covered by vitest
module.exports = {
  enabled: true,
  include: [
    // ultimately we want all the src files to be covered
    // "src/**/*.ts"
    // but for now we are just getting started converting to vitest
    "src/{api,util}.ts",
    // "src/associations/internal/{getIncludesAndReferencesQuery,getIncludesDoesNotReferenceQuery,getReferencesDoesNotIncludeQuery}.ts",
    // "src/associations/{requestAssociation,breakAssociation}.ts",
    "src/core/_internal/sharedWith.ts",
    "src/access/*.ts",
    "src/associations/**/*.ts",
    "src/versioning/**/*.ts",
  ],
  // we have so many pre-existing istanbul ignore comments
  provider: "istanbul",
  // reporter: ["json", "html", "cobertura"],
  reportsDirectory: "./coverage",
  thresholds: {
    100: true
  }
};
