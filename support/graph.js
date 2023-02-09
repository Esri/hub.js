const madge = require('madge');

madge('./packages/common/src', {
  tsConfig: './tsconfig.json',
  fileExtensions: ['ts'],
} )
	.then((res) => res.image('packages/common/graph.svg'))
	.then((writtenImagePath) => {
		console.log('Image written to ' + writtenImagePath);
	});