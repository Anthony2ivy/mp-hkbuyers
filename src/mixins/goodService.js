const baseUrl="https://www.shitaidaigou.club";
const goodService={
  addGoodRequest(data){
    return new Promise((resolve, reject) => {
      wx.request({
        url:baseUrl+'/good',
        method:'POST',
        dataType:'json',
        header:{'Content-Type':'application/x-www-form-urlencoded'},
        data:data,
        success:res =>{
          resolve(res);
        },
        fail:e =>{
          reject(e);
        }
      });
    });
  }
}

export default goodService
