<template>
  <div id="merchantGroup">
    <div class="breadcrumb">
      <span>位置：</span>
      <el-breadcrumb separator=">" separator-class="el-icon-d-arrow-right">
        <el-breadcrumb-item :to="{path:'/order'}">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>商户分组</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="Group-wrap">
      <el-button size="small">新建分组</el-button>
      <div class="table-box">
        <el-table :data="tableData" size="small" style="width: 100%;" v-loading="loading">
          <el-table-column align="center" prop="name" label="分组名称"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="props">
              <div class="table-button">
                <span @click="nameVisible=true">命名</span>
                <span @click="manageVisible=true">管理</span>
                <span>删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog class="changeName" :visible.sync="nameVisible">
      <div>
        <span class="label">分组名称：</span>
        <el-input size="small"></el-input>
      </div>
      <div class="name-button">
        <el-button class="other-button" size="mini">取消</el-button>
        <el-button size="mini">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="manage" :visible.sync="manageVisible">
        <div>
          <el-transfer
            v-model="chooseValue"
            filterable
            :titles="['商户列表', '分组列表']"
            :button-texts="['删除','添加']"
            :data="data"
          >

          </el-transfer>
          <div class="button-wrap">
            <el-button size="small" class="other-button">取消</el-button>
            <el-button size="small">确定</el-button>
          </div>

        </div>
        <div class="left-title">
          商户列表
        </div>
    </el-dialog>

  </div>
</template>
<script type="text/javascript">
  import unit from '@/unit/unit.js';
  export default{
      data(){
          const generateData = _ => {
            const data = [];
            for (let i = 1; i <= 20; i++) {
              data.push({
                key: i,
                label: `备选项 ${ i }`
              });
            }
            return data;
          };
          return {
            loading:false,
            nameVisible:false,
            manageVisible:true,
            tableData:[
              {}
            ],
            data: generateData(),
            chooseValue: [1, 4]
          }
      }
  }
</script>
<style lang="scss">
  #merchantGroup{
    background:#fff;
    .breadcrumb {
      vertical-align: middle;
      padding: 10px;
      padding-left: 20px;
      border-bottom: 1px solid #e8e8e8;
    }
    .breadcrumb span {
      display: inline-block;
      font-size: 14px;
      line-height: 16px;
      vertical-align: middle;
    }
    .el-breadcrumb {
      display: inline-block;
      vertical-align: middle;
    }
    .Group-wrap{
      padding:20px;
    }
    .table-box{
      padding-top:20px;
    }
    .table-button{
      span {
        cursor: pointer;
        padding:0 10px;
        text-decoration: underline;
        display: inline-block;
        position: relative;
        color: #1188ee;
      }
      span:after{
        content: '';
        display: block;
        width: 1px;
        background: #e4e8f1;
        height: 14px;
        position: absolute;
        right:0;
        top:6px;
      }
      span:last-child:after{
        content: '';
        display: block;
        width:0;
      }
    }
    .changeName{
      .el-dialog{
        width: 466px;
        padding:0 10px;
        .label{
          font-size:16px;
        }
        .el-input{
          display: inline-block;
          width: 300px;
        }
        .name-button{
          padding-top:20px;
          margin-left:84px;
          .el-button{
            width: 100px;
          }
        }
      }
    }
    .manage{
      .el-input__prefix{
        width: 40px;
      }
      .el-transfer-panel{
        width: 320px;
      }
      .el-dialog__body{
        padding:40px 56px 20px 56px;
      }
      .el-transfer__buttons{
        padding:0 50px;
        width: 100px;
        button{
          width:100%;
          text-align: center;
          margin-bottom:16px;
        }
      }
      .el-dialog{
        width:954px;
      }
      .el-transfer-panel__body{
        height:350px;
      }
      .el-transfer-panel__list.is-filterable{
        height:340px;
      }
      .button-wrap{
        margin-top:20px;
        text-align: center;
        .el-button{
          width:100px;
        }
      }
      .left-title{
        position: absolute;
        width:318px;
        box-sizing: border-box;
        height:40px;
        top:71px;
        left:57px;
        z-index: 1000;
        background: #f5f7fa;
        /*background: #000;*/
        color: #000;
        border-radius:4px 4px 0 0;
        font-size: 16px;
        line-height:40px;
        font-weight:400;
        padding-left:36px;
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
</style>
