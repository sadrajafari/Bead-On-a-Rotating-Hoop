// Copyright 2025, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Sadra
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import beadOnHoop from '../beadOnHoop.js';

const BeadOnHoopQueryParameters = QueryStringMachine.getAll( {
  //TODO add schemas for query parameters
} );

beadOnHoop.register( 'BeadOnHoopQueryParameters', BeadOnHoopQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.beadOnHoop.BeadOnHoopQueryParameters' );

export default BeadOnHoopQueryParameters;