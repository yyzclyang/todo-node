const db = require('./db.js');
const inquirer = require('inquirer');

module.exports.add = async (task) => {
  const taskList = await db.read();
  taskList.push({ title: task, done: false });
  await db.write(taskList);
};

module.exports.clear = async () => {
  await db.write([]);
};

const createOrUpdateTask = (taskList, index, isCreate = true) => {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: `请${isCreate ? '' : '重新'}输入任务：`,
      default: isCreate ? '' : taskList[index].title
    })
    .then((task) => {
      isCreate
        ? !!task.title
          ? taskList.push({ title: task.title, done: false })
          : console.log('任务名不能为空！')
        : (taskList[index].title = task.title);
      db.write(taskList);
    });
};

const askForAction = (taskList, index) => {
  inquirer
    .prompt({
      type: 'list',
      name: 'type',
      message: '请选择要进行的操作：',
      choices: [
        { name: '退出', value: 'quit' },
        { name: '已完成', value: 'markDone' },
        { name: '未完成', value: 'markUndone' },
        { name: '修改任务', value: 'updateTask' },
        { name: '删除任务', value: 'deleteTask' }
      ]
    })
    .then((action) => {
      switch (action.type) {
        case 'markDone':
          {
            taskList[index].done = true;
            db.write(taskList);
          }
          break;
        case 'markUndone':
          {
            taskList[index].done = false;
            db.write(taskList);
          }
          break;
        case 'updateTask':
          {
            createOrUpdateTask(taskList, index, false);
          }
          break;
        case 'deleteTask':
          {
            taskList.splice(index, 1);
            db.write(taskList);
          }
          break;
        default: {
        }
      }
    });
};

const printTasks = (taskList) => {
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择你要操作的任务?',
      choices: [
        { name: '退出', value: '-3' },
        { name: '+ 创建任务', value: '-2' },
        { name: '+ 清空任务', value: '-1' },
        ...taskList.map((task, index) => ({
          name: `${index + 1} - ${task.title}`,
          value: `${index}`
        }))
      ]
    })
    .then((select) => {
      switch (parseInt(select.index, 10)) {
        // 退出
        case -3:
          break;
        // 创建新任务
        case -2:
          {
            createOrUpdateTask(taskList, undefined, true);
          }
          break;
        // 清空任务
        case -1:
          {
            clear().then(
              () => {
                console.log('清除成功！');
              },
              () => {
                console.log('清除失败！');
              }
            );
          }
          break;
        // 选择任务
        default: {
          askForAction(taskList, parseInt(select.index, 10));
        }
      }
    });
};

module.exports.showAll = async () => {
  const taskList = await db.read();
  printTasks(taskList);
};
