import { getCurationListService, postCurationService, putCurationService, deleteCurationService } from '../Services/CurationService.js'; // prettier-ignore

class CurationController {
  async getCurationList(req, res) {
    const data = await getCurationListService(parseInt(req.params.id), req.query) // prettier-ignore
    res.status(200).json(data);
  }
  async postCuration(req, res) {
    const data = await postCurationService(parseInt(req.params.id), req.body);
    res.status(201).json(data);
  }
  async putCuration(req, res) {
    const data = await putCurationService(parseInt(req.params.id), req.body); // prettier-ignore
    res.status(200).json(data);
  }
  async deleteCuration(req, res) {
    const data = await deleteCurationService(parseInt(req.params.id), req.body);
    res.status(200).json(data);
  }
}

export default new CurationController();
