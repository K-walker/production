package com.king.tetris;

import android.animation.ObjectAnimator;
import android.app.Activity;
import android.graphics.PointF;
import android.os.Bundle;
import android.view.View;

import com.king.tetris.model.Bulge;
import com.king.tetris.widget.TetrisView;

public class TetrisActivity extends Activity {
	
	TetrisView mTetrisView ;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_tetris);
		mTetrisView = (TetrisView) findViewById(R.id.tetrisView);
		mTetrisView.setShape(new Bulge(new PointF(2, 0) , 50, Direction.DOWN));
	}
	
	public void onKeyDown(View view) {
		switch (view.getId()) {
		case R.id.change:
			mTetrisView.setChange();
			break;
		case R.id.start:
			mTetrisView.startGame();
			break;
		case R.id.stop:
			mTetrisView.stopGame();
			break;
		case R.id.left:
			mTetrisView.moveToLeft(mTetrisView.getShape());
			break;
		case R.id.right:
			mTetrisView.moveToRight(mTetrisView.getShape());
			break;
		}
	}
	
	private void startAnimator () {
		
	}
}
