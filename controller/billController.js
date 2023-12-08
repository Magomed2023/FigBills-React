import Bill from "../model/billModel.js";

export const create = async(req, res)=>{
    try {

        const billData = new Bill (req.body);

        if(!billData){
            return res.status(404).json({msg: "Bill data not found"});
        }

        await billData.save();
        res.status(200).json({msg: "Bill created successfully"});

    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const getAll = async (req, res) => {
    try {
      const useAll = req.query.useAll === "true";
      const page = parseInt(req.query.page) || 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;
  
      const billData = useAll ? await Bill.find() : await Bill.find().skip(skip).limit(pageSize);
      const count = await Bill.countDocuments();
      const pages = Math.ceil(count / pageSize);
  
      if (!billData) {
        return res.status(404).json({ msg: "Bill data not found" });
      }
  
      res.status(200).json({ data: billData, pagination: { pages } });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };


/*export const getAll = async(req, res) =>{
    try {

        const billData = await Bill.find();
        if(!billData){
            return res.status(404).json({msg:"Bill data not found"});
        }
        res.status(200).json(billData);
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}*/


export const getOne = async(req, res) =>{
    try {

        const id = req.params.id;
        const billExist = await Bill.findById(id);
        if(!billExist){
            return res.status(404).json({msg: "Bill not found"});
        }
        res.status(200).json(billExist);
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const update = async(req, res) =>{
    try {

        const id = req.params.id;
        const billExist = await Bill.findById(id);
        if(!billExist){
            return res.status(401).json({msg:"Bill not found"});
        }

        const updatedData = await Bill.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json({msg: "Bill updated successfully"});
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const deleteBill = async(req, res) =>{
    try {

        const id = req.params.id;
        const billExist = await Bill.findById(id);
        if(!billExist){
            return res.status(404).json({msg: "Bill not exist"});
        }
        await Bill.findByIdAndDelete(id);
        res.status(200).json({msg: "Bill deleted successfully"});
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}