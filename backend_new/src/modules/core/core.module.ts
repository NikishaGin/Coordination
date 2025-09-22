import { Module } from '@nestjs/common';
import { IndicatorsService } from './services/indicators.service';
import {CalculatedActualValuesService} from "./services/calculated-actual-values.service";
import {AutoCompleteService} from "./services/auto-complete.service";

@Module({
    providers: [
        CalculatedActualValuesService,
        AutoCompleteService,
        IndicatorsService
    ],
    exports: [
        CalculatedActualValuesService,
        AutoCompleteService,
        IndicatorsService
    ],
})
export class CoreModule {}
