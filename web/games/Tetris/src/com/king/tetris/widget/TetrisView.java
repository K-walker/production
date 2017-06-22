package com.king.tetris.widget;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.PointF;
import android.graphics.RectF;
import android.os.Handler;
import android.util.AttributeSet;
import android.view.View;

import com.king.tetris.Direction;
import com.king.tetris.model.Bulge;
import com.king.tetris.model.L_shape;
import com.king.tetris.model.Ladder;
import com.king.tetris.model.Rectangle;
import com.king.tetris.model.Shape;
import com.king.tetris.model.Square;

public class TetrisView extends View {
	/**
	 * 方块下落的延迟时间
	 */
	private static final int DEFAULT_DELAY_MILLIS = 500 ;
	/**
	 * 每个地图块的大小
	 */
	private static final int DEFAULT_MAP_BLOCK_SIZE = 50 ;
	private Paint mPaint ;
	private Paint mMapPaint ;
	private Shape mShape ;
	
	private float gameMap [][] ;
	/**
	 * 保存所有行值得总和
	 */
	private int rowValueSum [] ;
	/**
	 * 需要被固定绘制在地图上的图形
	 */
	private List<PointF> mDrawShapes ;
	/**需要被消除的行*/
	private List<PointF> mClearRowShapes ;
	/**row 行  column 列*/
	private int rowNum ;
	private int columnNum ;
	private int width ;
	private int height ;
	private Handler handler ;
	private AutoFallRunnable runnable ;
	public TetrisView(Context context , AttributeSet attrs , int defStyleAttr) {
		super(context, attrs , defStyleAttr);
		init();
	}

	public TetrisView(Context context, AttributeSet attrs) {
		this(context, attrs , 0);
	}

	public TetrisView(Context context) {
		this(context , null );
	}

	
	@Override
	protected void onSizeChanged(int w, int h, int oldw, int oldh) {
		super.onSizeChanged(w , h , oldw, oldh);
		columnNum = w / DEFAULT_MAP_BLOCK_SIZE ; // 列 32
		rowNum = h / DEFAULT_MAP_BLOCK_SIZE ;    // 行 18
		gameMap = new float[columnNum][rowNum] ;
		rowValueSum = new int[rowNum];
		width = w ;
		height = h ;
	}
	
	private void init() {
		mDrawShapes = new ArrayList<>();
		mClearRowShapes = new ArrayList<PointF>();
		handler = new Handler();
		mPaint = new Paint();
		mPaint.setColor(Color.BLUE);
		mPaint.setStyle(Style.FILL_AND_STROKE);
		
		mMapPaint = new Paint(mPaint);
		mMapPaint.setColor(Color.WHITE);
	}
	
	public void setShape (Shape shape) {
		this.mShape = shape ;
		startGame();
	}
	
	public Shape getShape () {
		return this.mShape ;
	}
	
	public void setChange () {
		this.mShape.setDirection(mShape.getDirection().onRotate());
		invalidate();
	}

	@Override
	protected void onDraw(Canvas canvas) {
		super.onDraw(canvas);
		// 绘制游戏地图
		drawGameMap(canvas);
		// 绘制正在下落的图形方块
		drawFallShape(canvas);
		// 绘制已经下落完成的图形方块
		drawShapes(canvas);
	}
	
	/**
	 * 绘制已经下落完成的图形方块
	 * 判断是否有可以消除的行
	 * @param canvas
	 */
	private void drawShapes(Canvas canvas) {
		
		if(mDrawShapes.size() > 0) {
			
			for (int i = 0 ; i < rowValueSum.length; i++) {
				if(rowValueSum[i] == columnNum) {
					for (int j = 0; j < columnNum ; j++) {
						mClearRowShapes.add(new PointF(j, i));
					}
					rowValueSum[i] = 0 ;
				}
			}
			
			if(mClearRowShapes.size() > 0) {
				mDrawShapes.removeAll(mClearRowShapes);
				mClearRowShapes.clear() ;
			}
			
			for (PointF point : mDrawShapes) {
				canvas.drawRect(new RectF(
						DEFAULT_MAP_BLOCK_SIZE * point.x, 
						DEFAULT_MAP_BLOCK_SIZE * point.y, 
						DEFAULT_MAP_BLOCK_SIZE * (point.x + 1),  
						DEFAULT_MAP_BLOCK_SIZE * (point.y +1)), 
					mPaint);
			}
		}
	}
	
	/**
	 * 绘制正在下落的图形方块
	 * @param canvas
	 */
	private void drawFallShape(Canvas canvas) {
		if(mShape != null) {
			for (int i = 0; i < mShape.getPonits().size(); i++) {
				PointF point = mShape.getPonits().get(i);
				canvas.drawRect(new RectF(
							DEFAULT_MAP_BLOCK_SIZE * point.x, 
							DEFAULT_MAP_BLOCK_SIZE * point.y, 
							DEFAULT_MAP_BLOCK_SIZE * (point.x + 1),  
							DEFAULT_MAP_BLOCK_SIZE * (point.y +1)), 
						mPaint);
			}
		}
	}

	/**
	 * 绘制游戏地图
	 * @param canvas
	 */
	private void drawGameMap(Canvas canvas) {
		for (int i = 0; i < columnNum ; i++) {
			canvas.drawLine(i * DEFAULT_MAP_BLOCK_SIZE , 0 , i * DEFAULT_MAP_BLOCK_SIZE , height , mMapPaint);
		}
		for (int i = 0; i < rowNum ; i++) {
			canvas.drawLine(0, i * DEFAULT_MAP_BLOCK_SIZE , width , i * DEFAULT_MAP_BLOCK_SIZE, mMapPaint);
		}
	}

	public void startGame () {
		if(mShape != null && runnable == null) {
			runnable = new AutoFallRunnable();
		}
		handleAutoFallDelayedMessage();
	}
	
	public void stopGame () {
		if(runnable != null) {
			handler.removeCallbacksAndMessages(null);
			runnable = null ;
		}
	}
	
	private void handleAutoFallDelayedMessage () {
		handler.postDelayed(runnable , DEFAULT_DELAY_MILLIS);
	}
	
	/**
	 * 下落
	 */
	private  void onFall () {
		// 首先判断是否可以继续下落 ，碰到其他方块或者是接触到屏幕底部，都停止下落
		// 如果地图与下落的方块有重合的部分则，停止下落
		if(isCanMoveToDwon(mShape)) {
			List<PointF> ponits = mShape.getPonits();
			for (int i = 0 ; i < ponits.size(); i++) {
				ponits.get(i).y += 1;
			}
			mShape.getCenterPoint().y += 1 ;
			invalidate();
		} else {
			// 当方块遇到障碍物时，停止运动，并绘制在界面上，同时产生新的方块
			List<PointF> ponits = mShape.getPonits();
			for (int i = 0 ; i < ponits.size(); i++) {
				PointF point = ponits.get(i);
				if(point.y >= 0) {   // 过滤屏幕外的点
					gameMap[(int)point.x][(int)point.y] = 1 ;
					// 累加每行的值
					rowValueSum[(int)point.y] = rowValueSum[(int)point.y] + 1 ;
					mDrawShapes.add(point);
				} 
			}
			// 暂时直接停止
			stopGame();
			// 清除资源
			clear();
			
			invalidate();
			// 设置随机图形
			this.postDelayed(new Runnable() {
				@Override
				public void run() {
					setShape(getRandomShape());
				}
			}, 200);
		}
	}
	
	private void clear() {
		if(mShape != null) {
			this.mShape = null ;
		}
	}

	/**
	 * 判断是否可以向下移动
	 */
	private boolean isCanMoveToDwon (Shape shape) {
		boolean isCanFallDwon = true ;
		for (int i = 0; i < shape.getPonits().size(); i++) {
			PointF point = shape.getPonits().get(i);
			int y = (int) (point.y + 1) ;
			// 判断方块是否到达屏幕底部
			if(y >= rowNum) { isCanFallDwon = false ; break ; }
			// 当方块的某个区域的坐标处于地图中时，如果当前这个位置的地图上的值为1，则表示碰到其他已存在界面上的方块，运动停止
			if(point.x >= 0 && y >= 0 ) {
				if(gameMap[(int)point.x][y] == 1) {
					isCanFallDwon = false ;
					break;
				}
			}
		}
		return isCanFallDwon ;
	}
	
	/**
	 * 左移
	 */
	public void moveToLeft (Shape shape) {
		for (int i = 0; i < shape.getPonits().size(); i++) {
			PointF point = shape.getPonits().get(i);
			point.x  -= 1 ;
		}
		mShape.getCenterPoint().x -= 1 ;
		invalidate();
	}
	
	/**
	 * 右移
	 * @param shape
	 */
	public void moveToRight (Shape shape) {
		for (int i = 0; i < shape.getPonits().size(); i++) {
			PointF point = shape.getPonits().get(i);
			point.x  += 1 ;
		}
		mShape.getCenterPoint().x += 1 ;
		invalidate();
	}
	
	/**
	 * 自动下落的线程
	 * @author: 004928
	 * @date: 2016-9-9
	 */
	private class AutoFallRunnable implements Runnable {
		@Override
		public void run() {
			onFall();
			handleAutoFallDelayedMessage();
		}
	}
	
	private Shape getRandomShape () {
		Shape shape = null ;
		Random random = new Random();
		switch (random.nextInt(5)) {
		case 0:  // 正方形
			shape = new Square(new PointF(2, -2), DEFAULT_MAP_BLOCK_SIZE , Direction.UP);
			break;
		case 1:  // 长方形
			shape = new Rectangle(new PointF(1, -1), DEFAULT_MAP_BLOCK_SIZE , Direction.UP);
			break;
		case 2:  // L形
			shape = new L_shape(new PointF(2, -3), DEFAULT_MAP_BLOCK_SIZE , Direction.LEFT);
			break;
		case 3:  // 阶梯型(Z)
			shape = new Ladder(new PointF(2, -2), DEFAULT_MAP_BLOCK_SIZE, Direction.LEFT);
			break;
		case 4:  // 凸形
			shape = new Bulge(new PointF(2, -1), DEFAULT_MAP_BLOCK_SIZE, Direction.UP);
			break;
		}
		return shape ;
	}
}
