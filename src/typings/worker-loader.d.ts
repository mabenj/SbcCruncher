declare module "worker-loader!*" {
	// You need to change `Worker`, if you specified a different value for the `workerType` option
	class SolverWorker extends Worker {
		constructor();
	}

	// Uncomment this if you set the `esModule` option to `false`
	// export = WebpackWorker;
	export default SolverWorker;
}
