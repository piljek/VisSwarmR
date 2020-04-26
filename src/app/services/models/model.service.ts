import { Injectable } from '@angular/core';
import { ParameterControlService } from '../parameter-controls/parameter.service';
import { Couzin2002Model } from './couzin2002/couzin2002.service';
import { Model } from '../../interfaces/model';
import { MODELS } from '@assets/vdg-models';
import { Reynolds1999Model } from './reynolds1999/reynolds1999.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Model service selects model
 */
export class ModelService {

  model: string;

  constructor(private readonly couzinModel: Couzin2002Model,
              private readonly reynoldsModel: Reynolds1999Model) {
    // this.navigationService.modelSource$.subscribe(d => { this.model = d;});
  }

  /**
   * Returns the selected model
   * @param modelName "Couzin (2002)" or "Reynolds (1999)"
   */
  public getSelectedModel(modelName?: string): Model {
    // console.log(modelName)
    switch (modelName) {
      case MODELS.MODEL_COUZIN_2002.id: // .COUZIN_2002:
        // console.log("Couzin model selected")
        return this.couzinModel;
      case MODELS.MODEL_REYNOLDS_1999.id: // REYNOLDS_1999:
        // console.log("Reynolds model selected")
        return this.reynoldsModel;
    }
    return this.couzinModel;


  }
}
