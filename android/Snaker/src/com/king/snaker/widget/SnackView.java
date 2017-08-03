package com.king.snaker.widget;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Rect;
import android.os.Handler;
import android.util.AttributeSet;
import android.view.View;

import com.king.snaker.model.Body;
import com.king.snaker.model.Food;
import com.king.snaker.model.Snake;

public class SnackView extends View {
	
	/**食物的标示*/
	private static final int FOOD_FLAG = 0X00000 ;
	/**蛇的标示*/
	private static final int SNAKE_FLAG = 0X00001 ;
	/**地图边界*/
	private static final int OUTSIZE_OF_GAMEMAP_FLAG = 0X00002 ;
	/**没有物体标示*/
	private static final int NO_BODY_FLAG = 0X00003 ;
	
	/**初始化蛇的长度  >=1 */
	private static final int DEFAULT_SNAKE_SIZE = 1;
	/**默认每吃到一块食物获得的分数 */
	private static final int DEFAULT_FOOD_SCORE = 10 ;
	/**间隔移动时间 数值越小，速度越快 */
	private static final int DELAY_TIME_TO_MOVE = 300 ;
	/**每节蛇身体的默认长度*/
	private static final int DEFAULT_SNAKE_BODY_LENGTH = 20 ;
	/**保存位置信息的集合，用于判断随机产生的食物的位置是否和蛇的身体重复*/
	private Map<Integer , Integer> mPosMap ;
	/**蛇的身体集合 */
	private List<Body> paths ; 
	/**蛇的画笔*/
	private Paint mPaint ;
	/**食物的画笔*/
	private Paint mFoodPaint ;
	/**游戏地图数组 */
	private Body gameMap[][] = null ;
	/**地图数组的行列长度*/
	private int rowLength  , columnLength;
	/**蛇前进的方向*/
	private Direction mDirection = Direction.DOWN ;
	/**食物*/
	private Food mFood ;
	private Handler handler ;
	private AutoMoveRunnable runnable ;
	private OnGameRunningListener lisntener ;
	private boolean isGameOver = false ;
	
	public SnackView(Context context , AttributeSet attrs , int defStyleAttr) {
		super(context , attrs , defStyleAttr);
		init();
	}

	public SnackView(Context context, AttributeSet attrs) {
		this(context, attrs , 0);
	}

	public SnackView(Context context) {
		this(context , null);
	}
	
	/**
	 * 初始化画笔
	 */
	private void init() {
		mPosMap = new HashMap<>();
		paths = new ArrayList<>();
		handler = new Handler();
		
		mPaint = new Paint();
		mPaint.setColor(Color.GREEN);
		mPaint.setStyle(Style.FILL_AND_STROKE);
		
		mFoodPaint = new Paint(mPaint);
		mFoodPaint.setColor(Color.RED);
		
	}
	
	@Override
	protected void onSizeChanged(int w, int h, int oldw, int oldh) {
		super.onSizeChanged(w, h, oldw, oldh);
		rowLength = w / DEFAULT_SNAKE_BODY_LENGTH ;
		columnLength = h / DEFAULT_SNAKE_BODY_LENGTH ;
		// 初始化地图
		gameMap = new Body[rowLength][columnLength];
		initSnake();
	}
	
	/**
	 * 初始化蛇
	 */
	private void initSnake() {
		for (int i = 0 ; i < DEFAULT_SNAKE_SIZE ; i++) {
			Snake snake = new Snake(new Rect(0  ,  i * DEFAULT_SNAKE_BODY_LENGTH , DEFAULT_SNAKE_BODY_LENGTH  , DEFAULT_SNAKE_BODY_LENGTH + (i * DEFAULT_SNAKE_BODY_LENGTH) ));
			snake.setX(0);
			snake.setY(i);
			mPosMap.put(0 , i);
			paths.add(snake);
			gameMap[0][i] = snake ;
		}
	}
	
	/**
	 * 移动：根据判断执行下一步操作
	 * @param direction
	 */
	private void move (Direction direction) {
		// 获取蛇头
		Body snakeHeader = paths.get(paths.size() - 1) ;
		// 判断游戏是否结束
		int isGameOver = isGameOver(snakeHeader);
		switch (isGameOver) {
		// 碰到边界或者是自己，游戏结束
		case OUTSIZE_OF_GAMEMAP_FLAG:
		case SNAKE_FLAG:
			// 游戏结束
			break;
		case FOOD_FLAG: // 吃食物
			eatFood();
			break;
		case NO_BODY_FLAG: // 向前移动
			moveToNext(snakeHeader , direction);
			break ;
		default:
			break;
		}
	}
	/**
	 * 蛇头向前移动
	 * @param snakeHeader
	 * @param direction
	 */
	private void moveToNext (Body snakeHeader , Direction direction) {
		// 获取头的位置
		Rect fisrtRect = snakeHeader.getRect() ;
		// 创建一个新的头
		Snake addSnake = new Snake(new Rect(fisrtRect));
		
		switch (direction) {
		case LEFT:
			addSnake.getRect().left -=  DEFAULT_SNAKE_BODY_LENGTH ;
			addSnake.getRect().right -=  DEFAULT_SNAKE_BODY_LENGTH ;
			
			addSnake.setX(snakeHeader.getX() - 1);
			addSnake.setY(snakeHeader.getY() );
			
			update(addSnake);
			break;
		case UP:
			addSnake.getRect().top -=  DEFAULT_SNAKE_BODY_LENGTH ;
			addSnake.getRect().bottom -=  DEFAULT_SNAKE_BODY_LENGTH ;
			
			addSnake.setX(snakeHeader.getX());
			addSnake.setY(snakeHeader.getY() - 1);
			
			update(addSnake);
			break;
		case RIGHT:
			addSnake.getRect().left +=  DEFAULT_SNAKE_BODY_LENGTH ;
			addSnake.getRect().right +=  DEFAULT_SNAKE_BODY_LENGTH ;
			
			addSnake.setX(snakeHeader.getX() + 1);
			addSnake.setY(snakeHeader.getY());
			
			update(addSnake);
			break;
		case DOWN:
			addSnake.getRect().top +=  DEFAULT_SNAKE_BODY_LENGTH ;
			addSnake.getRect().bottom +=  DEFAULT_SNAKE_BODY_LENGTH ;
			
			addSnake.setX(snakeHeader.getX());
			addSnake.setY(snakeHeader.getY() + 1);
			
			update(addSnake);
			break;
		}
	}
	
	/**
	 * 吃食物：将食物添加进蛇头，并绘制界面，移除食物
	 * @param snake
	 */
	private void eatFood () {
		paths.add(mFood);
		// 更新位置
		mPosMap.put(mFood.getX(), mFood.getY());
		invalidate();
		mFood = null ;
		if(this.lisntener != null) {
			lisntener.onGetScore(DEFAULT_FOOD_SCORE);
		}
	}
	
	private void update (Body snake) {
		// 添加一个蛇头
		paths.add(snake);
		// 往地图中添加蛇
		gameMap[snake.getX()][snake.getY()] = snake ;
		// 更新位置
		mPosMap.put(snake.getX(), snake.getY());
		
		// 移除蛇尾
		Body lastSnake = paths.remove(0);
		// 从地图中移除
		gameMap[lastSnake.getX()][lastSnake.getY()] = null ;
		// 清除被移除的蛇的位置
		mPosMap.remove(lastSnake.getX());
		
		// 更新画布
		invalidate();
	}
	
	/**
	 * 判断蛇头前面一格位置的信息
	 *  0.如果是边界则游戏结束
	 *  1.如果是蛇身，则游戏结束
	 *  2.如果是食物，吃进去
	 *  3.如果什么都没有，则前进
	 * @param x
	 * @param y
	 * @return 0 表示食物 ；1 表示蛇身，游戏结束 ；  2 表示边界，游戏结束 ； 3 什么都没有
	 */
	private int isGameOver (Body body) {
		Body front = null ;
		// 表示蛇前方碰见的东西
		int frontThing = NO_BODY_FLAG ;
		switch (getDirection()) {
		case LEFT:
			// 地图边界 ， 游戏结束
			if(body.getRect().left <= 0) {
				onStopGame();
				frontThing = OUTSIZE_OF_GAMEMAP_FLAG ;
			} else {
				front = gameMap[body.getX() -1 ][body.getY()];
				// 是自己的身体，游戏结束
				if(front != null && front.getFlag() == SNAKE_FLAG) {
					onStopGame();
					frontThing = SNAKE_FLAG ;
				}  else if(front != null && front.getFlag() == FOOD_FLAG) {
					frontThing = FOOD_FLAG ;
				}
			}
			break;
		case UP:
			// 地图边界 ， 游戏结束
			if(body.getRect().top <= 0) {
				onStopGame();
				frontThing = NO_BODY_FLAG ;
			} else {
				front = gameMap[body.getX()][body.getY() - 1];
				// 是自己的身体，游戏结束
				if(front != null && front.getFlag() == SNAKE_FLAG) {
					onStopGame();
					frontThing = SNAKE_FLAG ;
				}  else if(front != null && front.getFlag() == FOOD_FLAG) {
					frontThing = FOOD_FLAG ;
				}
			}
			break;
		case RIGHT:
			// 地图边界 ， 游戏结束
			if(body.getRect().right >= getWidth()) {
				onStopGame();
				frontThing = NO_BODY_FLAG ;
			} else {
				front = gameMap[body.getX() + 1][body.getY()];
				// 是自己的身体，游戏结束
				if(front != null && front.getFlag() == SNAKE_FLAG) {
					onStopGame();
					frontThing = SNAKE_FLAG ;
				}  else if(front != null && front.getFlag() == FOOD_FLAG) {
					frontThing = FOOD_FLAG ;
				}
			}
			break;
		case DOWN:
			// 地图边界 ， 游戏结束
			if(body.getRect().bottom >= getHeight()) {
				onStopGame();
				frontThing = NO_BODY_FLAG ;
			} else {
				front = gameMap[body.getX()][body.getY() + 1];
				// 是自己的身体，游戏结束
				if(front != null && front.getFlag() == SNAKE_FLAG) {
					onStopGame();
					frontThing = SNAKE_FLAG ;
				}  else if(front != null && front.getFlag() == FOOD_FLAG) {
					frontThing = FOOD_FLAG ;
				}
			}
			break;
		}
		return frontThing ;
	}
	
	@Override
	protected void onDraw(Canvas canvas) {
		super.onDraw(canvas);
		for (int i = 0 ; i < paths.size(); i++) {
			canvas.drawRect(paths.get(i).getRect() , mPaint); 
		}
		// 绘制随机出现的食物,并且食物的位置不能是蛇身体的位置
		randomDrawFood(canvas);
		
	}
	
	/**
	 * 随机绘制食物
	 * @param canvas
	 */
	private void randomDrawFood(Canvas canvas) {
		if(mFood == null) {
			Random random = new Random();
			int row , column ;
			do {
				row = random.nextInt(rowLength);
				column = random.nextInt(columnLength);
			} while (mPosMap.get(row) != null && mPosMap.get(row) == column) ;  // 如果食物的位置和蛇的身体重复则重新选择
			
			mFood = new Food(new Rect(row * DEFAULT_SNAKE_BODY_LENGTH , column * DEFAULT_SNAKE_BODY_LENGTH , row * DEFAULT_SNAKE_BODY_LENGTH + DEFAULT_SNAKE_BODY_LENGTH , column * DEFAULT_SNAKE_BODY_LENGTH + DEFAULT_SNAKE_BODY_LENGTH));
			mFood.setX(row);
			mFood.setY(column);
			gameMap[row][column] = mFood ;
		}
		canvas.drawRect(mFood.getRect() , mFoodPaint);
	}

	public enum Direction {
		LEFT  {  Direction getOpposite() { return Direction.RIGHT ; } },
		UP    {  Direction getOpposite() { return Direction.DOWN  ; } },
		RIGHT {  Direction getOpposite() { return Direction.LEFT  ; } },
		DOWN  {  Direction getOpposite() { return Direction.UP    ; } };
		
		abstract Direction getOpposite();
	}
	
	/**
	 * 控制蛇移动的方向
	 * @param direction LEFT , UP , RIGHT , BOTTOM
	 */
	public void setDirection  (Direction direction) {
		// 判断改变的方向是否和正在移动的方向相反
		if(direction.getOpposite() == this.mDirection) {
			return ;
		}
		this.mDirection = direction ;
	}
	
	private Direction getDirection () {
		return this.mDirection ;
	}
	
	/**
	 * 游戏开始
	 */
	public void onStartMove () {
		if(runnable == null && !isGameOver) {
			runnable = new AutoMoveRunnable();
			handlerMoveMessage();
		}
	}
	/**
	 * 游戏暂停
	 */
	public void onPauseMove () {
		if(runnable != null && !isGameOver) {
			handler.removeCallbacks(runnable);
			runnable = null ;
		}
	}
	
	/**
	 * 游戏结束
	 */
	private void onStopGame () {
		onPauseMove();
		isGameOver = true ;
		if(this.lisntener != null) {
			lisntener.onGameOver();
		}
	}
	/**
	 * 清空数据，重绘
	 */
	public void onRestart () {
		if(isGameOver) {
			mPosMap.clear();
			for (Body body : paths) {
				gameMap[body.getX()][body.getY()] = null ;
			}
			paths.clear();
			mDirection = Direction.DOWN ;
			initSnake();
			invalidate();
			isGameOver = false ;
		}
	}
	
	private void handlerMoveMessage () {
		handler.postDelayed(runnable , DELAY_TIME_TO_MOVE);
	}
	
	private class AutoMoveRunnable implements Runnable {
		@Override
		public void run() {
			move(getDirection());
			handlerMoveMessage();
		}
	}
	
	public void setOnGameRunningListener (OnGameRunningListener l) {
		this.lisntener = l ;
	}
	
	public interface OnGameRunningListener {
		/**
		 * 游戏结束
		 */
		void onGameOver();
		/**
		 * 得分
		 * @param score
		 */
		void onGetScore(int score);
	}
}
